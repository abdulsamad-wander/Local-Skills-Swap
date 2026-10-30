import { useEffect } from "react";
import {
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";

/** Voice calls show participant avatars instead of empty video tiles. */
const VoiceStage = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div className="flex-1 grid place-items-center p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {participants.map((p) => (
            <div key={p.sessionId} className="flex flex-col items-center gap-3">
              <div className={`rounded-full ${p.isSpeaking ? "ring-4 ring-primary" : ""}`}>
                <UserAvatar src={p.image} name={p.name || p.userId} size="xl" />
              </div>
              <p className="font-bold">{p.name || p.userId}</p>
              {!p.audioStream && <p className="text-xs text-base-content/60">Muted</p>}
            </div>
          ))}
        </div>
        {participants.length <= 1 && (
          <p className="text-base-content/60">Waiting for the other person to join…</p>
        )}
      </div>
    </div>
  );
};

const CallContent = ({ audioOnly = false }) => {
  const call = useCall();
  const navigate = useNavigate();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    if (!call) return;
    const unsub = call.on("call.ended", () => navigate("/chats"));
    return () => unsub?.();
  }, [call, navigate]);

  useEffect(() => {
    if (callingState === CallingState.LEFT) navigate("/chats");
  }, [callingState, navigate]);

  return (
    <StreamTheme className="h-full flex flex-col">
      {audioOnly ? <VoiceStage /> : <SpeakerLayout />}
      <CallControls />
    </StreamTheme>
  );
};

export default CallContent;
