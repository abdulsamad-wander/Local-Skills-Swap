import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import toast from "react-hot-toast";
import { IoBan, IoEllipsisHorizontal, IoArrowBack, IoLockClosed } from "react-icons/io5";
import useAuthUser from "../hooks/useAuthUser";
import { useChat } from "../context/ChatContext";
import { useBlockStatus } from "../hooks/useBlockStatus";
import { channelIdFor, otherMemberOf } from "../lib/chatClient";
import { useThemeStore } from "../store/useThemeStore";
import { DARK_THEMES } from "../constants";
import ChatLoader from "../components/ChatLoader.jsx";
import CallButton from "../components/CallButton.jsx";
import GroupInfo from "../components/GroupInfo.jsx";
import PresenceLabel from "../components/PresenceDot.jsx";
import UserAvatar from "../components/UserAvatar.jsx";
import GroupAvatar from "../components/GroupAvatar.jsx";

/** Shared by the one to one route (/chat/:id) and the group route (/group/:id). */
const ChatPage = ({ group = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const { iBlocked, blockedMe, block, unblock, busy } = useBlockStatus();
  const { client, ready, clearUnreadFor, setActiveChannel } = useChat();
  const { theme } = useThemeStore();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  // channel.data mutates in place, so bump this to repaint the header
  const [, setChannelVersion] = useState(0);

  useEffect(() => {
    if (!ready || !authUser?._id || !id) return;
    let cancelled = false;

    const open = async () => {
      setLoading(true);
      try {
        const curr = group
          ? client.channel("messaging", id)
          : client.channel("messaging", channelIdFor(authUser._id, id), {
              members: [authUser._id, id],
            });

        await curr.watch();
        await curr.markRead().catch(() => {});
        if (cancelled) return;

        setChannel(curr);
        setActiveChannel(curr.cid);
        if (!group) clearUnreadFor(id);
      } catch (error) {
        if (cancelled) return;
        console.error("Error opening chat", error);
        toast.error("Could not open this conversation. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    open();

    return () => {
      cancelled = true;
      setActiveChannel(null);
    };
  }, [ready, client, authUser?._id, id, group, clearUnreadFor, setActiveChannel]);

  useEffect(() => {
    if (!channel) return;
    const handler = () => {
      channel.markRead().catch(() => {});
      if (!group) clearUnreadFor(id);
    };
    const onUpdated = () => setChannelVersion((v) => v + 1);

    channel.on("message.new", handler);
    channel.on("channel.updated", onUpdated);
    return () => {
      channel.off("message.new", handler);
      channel.off("channel.updated", onUpdated);
    };
  }, [channel, id, group, clearUnreadFor]);

  const startCall = async (audioOnly) => {
    if (!channel) return;
    const callURL = `${window.location.origin}/call/${channel.id}${audioOnly ? "?audio=1" : ""}`;
    try {
      await channel.sendMessage({
        text: `I started a ${audioOnly ? "voice" : "video"} call. Join me here: ${callURL}`,
      });
      window.open(callURL, "_blank", "noopener");
      toast.success("Call started. The link is in the chat.");
    } catch (err) {
      console.error(err);
      toast.error("Could not start the call. Please try again.");
    }
  };

  if (loading || !channel) return <ChatLoader />;

  // the chat always follows the app theme: pick Stream's matching base skin,
  // then str-chat--app-theme remaps its palette onto the theme tokens
  const baseSkin = DARK_THEMES.has(theme) ? "dark" : "light";
  const chatClass = `str-chat__theme-${baseSkin} str-chat--app-theme`;
  const memberCount = Object.keys(channel.state.members || {}).length;
  const other = group ? null : otherMemberOf(channel, authUser._id);
  const youBlockedThem = !group && iBlocked(id);
  const theyBlockedYou = !group && blockedMe(id);
  const conversationClosed = youBlockedThem || theyBlockedYou;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-base-100">
      {/* our own bar: presence for people, member count and info for groups */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-b border-base-200 shrink-0">
        <button
          onClick={() => navigate("/chats")}
          className="btn btn-ghost btn-sm btn-circle shrink-0"
          title="Back to chats"
          aria-label="Back to chats"
        >
          <IoArrowBack className="size-5" />
        </button>

        {group ? (
          <button
            onClick={() => setInfoOpen(true)}
            className="flex items-center gap-2 min-w-0 hover:opacity-80"
            title="Group info"
          >
            <GroupAvatar src={channel.data?.image} name={channel.data?.name} size="sm" />
            <span className="min-w-0 text-left">
              <span className="block font-extrabold truncate">{channel.data?.name || "Group"}</span>
              <span className="block text-xs text-base-content/60">{memberCount} members</span>
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5 min-w-0">
            <UserAvatar src={other?.image} name={other?.name} size="sm" />
            <div className="min-w-0">
              <p className="font-extrabold truncate leading-tight">{other?.name || "Conversation"}</p>
              <PresenceLabel userId={id} className="text-xs" />
            </div>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          {!conversationClosed && (
            <CallButton onVideoCall={() => startCall(false)} onVoiceCall={() => startCall(true)} />
          )}
          {!group && (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle" aria-label="More options">
                <IoEllipsisHorizontal className="size-5" />
              </button>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-2xl shadow-xl w-48 p-2 z-20">
                <li>
                  {youBlockedThem ? (
                    <button onClick={() => unblock(id)} disabled={busy}>
                      <IoBan className="size-4" />
                      Unblock
                    </button>
                  ) : (
                    <button className="text-error" onClick={() => block(id)} disabled={busy || theyBlockedYou}>
                      <IoBan className="size-4" />
                      Block this person
                    </button>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <Chat client={client} theme={chatClass}>
        <Channel channel={channel}>
          <div className="flex-1 min-h-0 flex">
            <Window>
              <MessageList />
              {conversationClosed ? (
                <div className="border-t border-base-200 bg-base-200/60 px-4 py-4 text-center">
                  <p className="flex items-center justify-center gap-2 font-semibold text-sm">
                    <IoLockClosed className="size-4" />
                    {youBlockedThem
                      ? `You blocked ${other?.name || "this person"}.`
                      : "You can't reply to this conversation."}
                  </p>
                  <p className="text-xs text-base-content/60 mt-1">
                    {youBlockedThem
                      ? "Neither of you can send messages until you unblock them."
                      : `${other?.name || "They"} blocked you.`}
                  </p>
                  {youBlockedThem && (
                    <button
                      onClick={() => unblock(id)}
                      disabled={busy}
                      className="btn btn-primary btn-sm rounded-full mt-3"
                    >
                      Unblock
                    </button>
                  )}
                </div>
              ) : (
                /* voice notes plus photo and file attachments */
                <MessageInput focus audioRecordingEnabled asyncMessagesMultiSendEnabled />
              )}
            </Window>
            <Thread />
          </div>
        </Channel>
      </Chat>

      {group && <GroupInfo channel={channel} open={infoOpen} onClose={() => setInfoOpen(false)} />}
    </div>
  );
};

export default ChatPage;
