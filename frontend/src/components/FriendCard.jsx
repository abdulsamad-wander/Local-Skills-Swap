import { Link } from "react-router-dom";
import { IoChatbubbleEllipsesOutline, IoBan } from "react-icons/io5";
import UserAvatar from "./UserAvatar";
import { useChat, usePresence } from "../context/ChatContext";
import { useBlockStatus } from "../hooks/useBlockStatus";
import PresenceLabel from "./PresenceDot";
import LanguagePair from "./LanguagePair";

const FriendCard = ({ friend }) => {
  const { unreadByUser } = useChat();
  const { online } = usePresence(friend._id);
  const { iBlocked, blockedMe, unblock, busy } = useBlockStatus();
  const youBlocked = iBlocked(friend._id);
  const theyBlocked = blockedMe(friend._id);
  const unread = unreadByUser[friend._id] || 0;

  return (
  <div className="person-card">
    <div className="flex items-center gap-3">
      <UserAvatar src={friend.profilePic} name={friend.fullName} size="md" online={online} unread={unread} />
      <div className="min-w-0">
        <h3 className="font-extrabold truncate">{friend.fullName}</h3>
        <PresenceLabel userId={friend._id} className="text-xs" />
      </div>
    </div>
    <LanguagePair native={friend.nativeLanguage} learning={friend.learningLanguage} compact />
    {youBlocked ? (
      <button onClick={() => unblock(friend._id)} disabled={busy} className="btn btn-outline rounded-full w-full gap-2">
        <IoBan className="size-5" />
        Unblock to message
      </button>
    ) : theyBlocked ? (
      <button disabled className="btn btn-disabled rounded-full w-full gap-2">
        <IoBan className="size-5" />
        Unavailable
      </button>
    ) : (
      <Link to={`/chat/${friend._id}`} className={`btn rounded-full w-full gap-2 ${unread ? "btn-secondary" : "btn-primary"}`}>
        <IoChatbubbleEllipsesOutline className="size-5" />
        {unread ? `${unread} new ${unread === 1 ? "message" : "messages"}` : "Message"}
      </Link>
    )}
  </div>
  );
};

export default FriendCard;
