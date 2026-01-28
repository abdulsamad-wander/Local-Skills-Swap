import { CiVideoOn } from "react-icons/ci";


function CallButton({ handleVideoCall }) {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0 z-10">
      <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white">
        <CiVideoOn className="w-6 h-6" />
      </button>
    </div>
  );
}

export default CallButton;