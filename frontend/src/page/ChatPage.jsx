import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader.jsx";
import CallButton from "../components/CallButton.jsx";

let globalChatClient = null;

const ChatPage = () => {
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();
  const { data: dataToken } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, //this will run only when authuser is avaiable
  });

  useEffect(() => {
    const initChat = async () => {
      if (!dataToken?.token || !authUser) return;
      try {
        console.log("Initializing stream chat...");
        let client = globalChatClient;
        client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic || null,
          },
          dataToken.token,
        );
        const channelId = [authUser._id, targetUserId].sort().join("-");
        //You and me
        //If I start a chat channelId = [myId, yourId],
        //If You start a chat channelId = [yourId, myId],
        //after sorting when I starts or You starts whatever channelId = [myId, yourId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat", error);
        toast.error("Could not connect to the chat. Please try again");
      } finally {
        setLoading(false);
      }
    };
    initChat();

    // cleanup on unmount
    return () => {
      if (globalChatClient) {
        globalChatClient.disconnectUser().catch(() => {});
        globalChatClient = null;
      }
    };
  }, [dataToken, authUser, targetUserId]);

  //handle video call
  const handleVideocall = async () => {
    if (!channel) return;
    const callURL = `${window.location.origin}/call/${channel.id}`;
    try {
      await channel.sendMessage({
        text: `I've started a video call. Join me here: ${callURL}`,
      });
      toast.success("Video call link sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send video call link.");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;
  return (
    <div className="h-[93vh]:">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideocall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
