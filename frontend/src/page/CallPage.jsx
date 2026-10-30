import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoader';
import CallContent from '../components/CallContent';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const CallPage = () => {
  const {id : callId } = useParams();
  const [client, setClient ] = useState(null);
  const[call, setCall] = useState(null);
  const[isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();
  const { data : tokenData} = useQuery({
    queryKey : ["streamToken"],
    queryFn : getStreamToken,
    enabled : !!authUser
  });

  useEffect(()=>{
    const initCall = async ()=>{
      if(!authUser || !tokenData?.token || !callId) return;
      try {
        console.log("Initializing stream video call....");
        const user = {
          id : authUser._id,
          name : authUser.fullName,
          image : authUser.profilePic,
        };
        const videoStreamClient = new StreamVideoClient({
          apiKey : STREAM_API_KEY,
          user,
          token : tokenData.token
        });

        const callInstance = videoStreamClient.call("default", callId);
        await callInstance.join({ create : true});
        console.log("Joined call successfully");
        setClient(videoStreamClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error in joining call", error);
        toast.error("Could not join call. Please try again");
      } finally{
        setIsConnecting(false);
      }
    };
    initCall();

    return () => {
      // leave the call and disconnect the client when leaving the page
      setCall((current) => {
        if (current) current.leave().catch(() => {});
        return null;
      });
      setClient((current) => {
        if (current) current.disconnectUser().catch(() => {});
        return null;
      });
    };
  },[tokenData, authUser, callId]);
  if(isLoading || isConnecting) return <PageLoader/>

  return (
    <div className="h-screen bg-base-100">
      <div className="h-full">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="h-full grid place-items-center p-6 text-center">
            <div>
              <h2 className="text-xl font-extrabold">Could not start the call</h2>
              <p className="text-base-content/60 mt-1">Refresh the page or try again from the chat.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallPage
