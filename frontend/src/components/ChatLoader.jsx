const ChatLoader = () => (
  <div className="h-full min-h-[60vh] grid place-items-center">
    <div className="flex flex-col items-center gap-3">
      <span className="loading loading-dots loading-lg text-primary" />
      <p className="font-semibold text-base-content/70">Opening conversation</p>
    </div>
  </div>
);

export default ChatLoader;
