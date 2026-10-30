import React, { useEffect } from "react";
import {
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCall,
} from "@stream-io/video-react-sdk";
import { useNavigate } from "react-router-dom";

const CallContent = () => {
  const call = useCall();
  const navigate = useNavigate();

  useEffect(() => {
    if (!call) return;

    const unsub = call.on("call.ended", () => {
      navigate("/");
    });

    return () => unsub?.();
  }, [call, navigate]);

  // callingState exists on call.state in all versions
  const callingState = call?.state?.callingState;

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallContent;
