import { IoVideocamOutline } from "react-icons/io5";

const CallButton = ({ handleVideoCall }) => (
  <button onClick={handleVideoCall} className="btn btn-primary btn-sm rounded-full gap-2" title="Start video call">
    <IoVideocamOutline className="size-5" />
    <span className="hidden sm:inline">Video call</span>
  </button>
);

export default CallButton;
