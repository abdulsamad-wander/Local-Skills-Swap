import { Link } from "react-router-dom";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import UserAvatar from "./UserAvatar";
import { useChat } from "../context/ChatContext";
import LanguagePair from "./LanguagePair";

const FriendCard = ({ friend }) => {
  const { unreadByUser } = useChat();
  const unread = unreadByUser[friend._id] || 0;

  return (
  <div className="person-card">
    <div className="flex items-center gap-3">
      <UserAvatar src={friend.profilePic} name={friend.fullName} size="md" online unread={unread} />
      <div className="min-w-0">
        <h3 className="font-extrabold truncate">{friend.fullName}</h3>
        {friend.location && <p className="text-xs text-base-content/60 truncate">{friend.location}</p>}
      </div>
    </div>
    <LanguagePair native={friend.nativeLanguage} learning={friend.learningLanguage} compact />
    <Link to={`/chat/${friend._id}`} className={`btn rounded-full w-full gap-2 ${unread ? "btn-secondary" : "btn-primary"}`}>
      <IoChatbubbleEllipsesOutline className="size-5" />
      {unread ? `${unread} new ${unread === 1 ? "message" : "messages"}` : "Message"}
    </Link>
  </div>
  );
};

export default FriendCard;
