import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  IoSearch,
  IoAdd,
  IoPin,
  IoPinOutline,
  IoNotificationsOffOutline,
  IoNotificationsOutline,
  IoPeople,
  IoEllipsisHorizontal,
  IoBan,
} from "react-icons/io5";
import useAuthUser from "../hooks/useAuthUser";
import { useChat } from "../context/ChatContext";
import { useBlockStatus } from "../hooks/useBlockStatus";
import { isGroupChannel, otherMemberOf } from "../lib/chatClient";
import { timeAgo } from "../lib/time";
import UserAvatar from "../components/UserAvatar";
import GroupAvatar from "../components/GroupAvatar";
import NewGroupModal from "../components/NewGroupModal";

const Chats = () => {
  const { client, ready, unreadByUser } = useChat();
  const { isBlocked } = useBlockStatus();
  const { authUser } = useAuthUser();
  const [channels, setChannels] = useState([]);
  const [query, setQuery] = useState("");
  const [messageHits, setMessageHits] = useState(null);
  const [searching, setSearching] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    if (!ready || !authUser?._id) return;
    let cancelled = false;

    client
      .queryChannels(
        { type: "messaging", members: { $in: [authUser._id] } },
        [{ pinned_at: -1 }, { last_message_at: -1 }],
        { watch: true, state: true, limit: 50 }
      )
      .then((list) => {
        if (!cancelled) setChannels(list);
      })
      .catch((e) => console.error("Could not load conversations", e));

    return () => {
      cancelled = true;
    };
  }, [client, ready, authUser?._id, version]);

  // refresh the list whenever a message lands so ordering stays right
  useEffect(() => {
    if (!ready) return;
    const bump = () => refresh();
    client.on("message.new", bump);
    client.on("channel.updated", bump);
    client.on("notification.added_to_channel", bump);
    client.on("notification.removed_from_channel", bump);
    return () => {
      client.off("message.new", bump);
      client.off("channel.updated", bump);
      client.off("notification.added_to_channel", bump);
      client.off("notification.removed_from_channel", bump);
    };
  }, [client, ready, refresh]);

  // searching message text uses Stream's search, names filter locally
  useEffect(() => {
    const q = query.trim();
    let cancelled = false;

    // short queries only filter names locally, so clear any previous hits
    const t = setTimeout(() => {
      if (q.length < 2) {
        setMessageHits(null);
        setSearching(false);
        return;
      }
      setSearching(true);
      client
        .search({ type: "messaging", members: { $in: [authUser._id] } }, q, { limit: 20 })
        .then((res) => {
          if (!cancelled) setMessageHits(res.results || []);
        })
        .catch(() => !cancelled && setMessageHits([]))
        .finally(() => !cancelled && setSearching(false));
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, client, authUser?._id]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return channels
      .map((ch) => {
        const group = isGroupChannel(ch);
        const other = group ? null : otherMemberOf(ch, authUser?._id);
        const title = group ? ch.data?.name || "Group" : other?.name || "Conversation";
        const unread = group ? ch.countUnread() : unreadByUser[other?.id] || ch.countUnread();
        return {
          ch,
          group,
          other,
          title,
          unread,
          pinned: Boolean(ch.state.membership?.pinned_at),
          muted: ch.muteStatus?.().muted ?? false,
          last: ch.state.messages?.[ch.state.messages.length - 1],
          blocked: !group && isBlocked(other?.id),
          to: group ? `/group/${ch.id}` : `/chat/${other?.id}`,
        };
      })
      .filter((r) => (q ? r.title.toLowerCase().includes(q) : true));
  }, [channels, authUser?._id, unreadByUser, query, isBlocked]);

  const togglePin = async (row) => {
    try {
      await (row.pinned ? row.ch.unpin() : row.ch.pin());
      toast.success(row.pinned ? "Unpinned" : "Pinned to top");
      refresh();
    } catch {
      toast.error("Could not update this chat. Please try again.");
    }
  };

  const toggleMute = async (row) => {
    try {
      await (row.muted ? row.ch.unmute() : row.ch.mute());
      toast.success(row.muted ? "Unmuted" : "Muted");
      refresh();
    } catch {
      toast.error("Could not update this chat. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Chats</h2>
          <p className="text-base-content/60 mt-1">Your conversations and groups.</p>
        </div>
        <button onClick={() => setGroupOpen(true)} className="btn btn-primary btn-sm rounded-full gap-2">
          <IoAdd className="size-5" />
          New group
        </button>
      </div>

      <div className="relative">
        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chats and messages"
          className="input input-bordered rounded-2xl w-full pl-11"
        />
      </div>

      {rows.length === 0 && !messageHits?.length ? (
        <div className="rounded-3xl border-2 border-dashed border-base-300 p-10 text-center">
          <IoPeople className="size-10 mx-auto text-base-content/40" />
          <h3 className="font-extrabold text-lg mt-3">
            {query ? "Nothing matches that" : "No conversations yet"}
          </h3>
          <p className="text-base-content/60 mt-1">
            {query ? "Try a different word." : "Message a friend or start a group."}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.ch.cid} className="rounded-3xl bg-base-200 flex items-center gap-3 p-3">
              <Link to={r.to} className="flex items-center gap-3 flex-1 min-w-0">
                {r.group ? (
                  <GroupAvatar src={r.ch.data?.image} name={r.title} size="md" />
                ) : (
                  <UserAvatar src={r.other?.image} name={r.title} size="md" unread={0} />
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="font-extrabold truncate">{r.title}</span>
                    {r.pinned && <IoPin className="size-3.5 text-base-content/50 shrink-0" />}
                    {r.muted && <IoNotificationsOffOutline className="size-3.5 text-base-content/50 shrink-0" />}
                    {r.blocked && (
                      <span className="badge badge-ghost badge-sm gap-1 shrink-0">
                        <IoBan className="size-3" />
                        Blocked
                      </span>
                    )}
                  </span>
                  <span className="block text-sm text-base-content/60 truncate">
                    {r.blocked
                      ? "Messages are turned off"
                      : r.last?.text ||
                        (r.group ? `${Object.keys(r.ch.state.members).length} members` : "Say hello")}
                  </span>
                </span>
              </Link>

              <div className="flex items-center gap-2 shrink-0">
                {r.last?.created_at && (
                  <span className="hidden sm:block text-xs text-base-content/50">
                    {timeAgo(r.last.created_at)}
                  </span>
                )}
                {r.unread > 0 && (
                  <span className="badge badge-secondary badge-sm font-bold">
                    {r.unread > 9 ? "9+" : r.unread}
                  </span>
                )}
                <div className="dropdown dropdown-end">
                  <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle" aria-label="Chat options">
                    <IoEllipsisHorizontal className="size-5" />
                  </button>
                  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-2xl shadow-xl w-44 p-2 z-10">
                    <li>
                      <button onClick={() => togglePin(r)}>
                        {r.pinned ? <IoPinOutline className="size-4" /> : <IoPin className="size-4" />}
                        {r.pinned ? "Unpin" : "Pin to top"}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => toggleMute(r)}>
                        {r.muted ? (
                          <IoNotificationsOutline className="size-4" />
                        ) : (
                          <IoNotificationsOffOutline className="size-4" />
                        )}
                        {r.muted ? "Unmute" : "Mute"}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {query.trim().length >= 2 && (
        <section>
          <h3 className="font-bold text-base-content/70 mb-2">
            Messages {searching && <span className="loading loading-spinner loading-xs ml-1" />}
          </h3>
          {messageHits?.length ? (
            <ul className="space-y-2">
              {messageHits.map(({ message }) => (
                <li key={message.id} className="rounded-2xl bg-base-200 p-3">
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-base-content/50 mt-1">
                    {message.user?.name} · {timeAgo(message.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            !searching && <p className="text-sm text-base-content/60">No messages match that.</p>
          )}
        </section>
      )}

      <NewGroupModal open={groupOpen} onClose={() => setGroupOpen(false)} />
    </div>
  );
};

export default Chats;
