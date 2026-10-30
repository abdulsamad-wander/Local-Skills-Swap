import { IoVideocamOutline, IoCallOutline } from "react-icons/io5";

const CallButton = ({ onVideoCall, onVoiceCall, disabled }) => (
  <div className="flex items-center gap-1.5">
    <button
      onClick={onVoiceCall}
      disabled={disabled}
      className="btn btn-ghost btn-sm btn-circle bg-base-100/80"
      title="Start voice call"
      aria-label="Start voice call"
    >
      <IoCallOutline className="size-5" />
    </button>
    <button
      onClick={onVideoCall}
      disabled={disabled}
      className="btn btn-primary btn-sm rounded-full gap-2"
      title="Start video call"
    >
      <IoVideocamOutline className="size-5" />
      <span className="hidden sm:inline">Video call</span>
    </button>
  </div>
);

export default CallButton;
