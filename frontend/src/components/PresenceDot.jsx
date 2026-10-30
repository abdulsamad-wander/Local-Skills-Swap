import { usePresence } from "../context/ChatContext";
import { timeAgo } from "../lib/time";

/** "Online" or "Last seen 2h ago" for a user. */
const PresenceLabel = ({ userId, className = "" }) => {
  const { online, lastActive } = usePresence(userId);

  if (online) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-success ${className}`}>
        <span className="size-2 rounded-full bg-success" />
        Online
      </span>
    );
  }

  if (!lastActive) return null;

  return <span className={`text-base-content/60 ${className}`}>Last seen {timeAgo(lastActive)}</span>;
};

export default PresenceLabel;
