import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";
import { chatClient, connectChatUser } from "../lib/chatClient";
import { ChatContext } from "./ChatContext";
import UserAvatar from "../components/UserAvatar";

/**
 * Connects the signed-in user to Stream once and keeps a per-friend unread
 * count, so avatars and the nav can show badges anywhere in the app.
 */
const ChatProvider = ({ children }) => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [unreadByUser, setUnreadByUser] = useState({});
  const [presenceByUser, setPresenceByUser] = useState({});
  // channel the user is currently looking at; its messages never count as unread
  const activeChannelRef = useRef(null);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: Boolean(authUser?.isOnboarded),
  });

  const setActiveChannel = useCallback((cid) => {
    activeChannelRef.current = cid;
  }, []);

  const clearUnreadFor = useCallback((userId) => {
    setUnreadByUser((prev) => {
      if (!prev[userId]) return prev;
      const next = { ...prev };
      delete next[userId];
      return next;
    });
  }, []);

  useEffect(() => {
    if (!authUser?._id || !tokenData?.token) return;

    let cancelled = false;
    let detach = () => {};

    const start = async () => {
      try {
        await connectChatUser(
          { id: authUser._id, name: authUser.fullName, image: authUser.profilePic || undefined },
          tokenData.token
        );
        if (cancelled) return;

        // seed counts from Stream's own unread state
        const channels = await chatClient.queryChannels(
          { type: "messaging", members: { $in: [authUser._id] } },
          { last_message_at: -1 },
          { watch: true, state: true }
        );
        if (cancelled) return;

        const seeded = {};
        const presence = {};
        channels.forEach((ch) => {
          const members = Object.values(ch.state.members);
          members.forEach((m) => {
            if (m.user_id === authUser._id || !m.user) return;
            presence[m.user_id] = {
              online: Boolean(m.user.online),
              lastActive: m.user.last_active || null,
            };
          });

          const count = ch.countUnread();
          if (!count) return;
          // unread badges are per person, so only one to one channels count
          if (members.length === 2) {
            const other = members.find((m) => m.user_id !== authUser._id);
            if (other) seeded[other.user_id] = count;
          }
        });
        setUnreadByUser(seeded);
        setPresenceByUser(presence);
        setReady(true);

        const handler = (event) => {
          const senderId = event.user?.id || event.message?.user?.id;
          if (!senderId || senderId === authUser._id) return;
          if (event.cid && event.cid === activeChannelRef.current) return;

          const sender = event.user || event.message?.user || {};

          setUnreadByUser((prev) => ({ ...prev, [senderId]: (prev[senderId] || 0) + 1 }));

          const targetId = senderId;
          toast.custom(
            (t) => (
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate(`/chat/${targetId}`);
                }}
                className="flex items-center gap-3 rounded-2xl bg-base-200 shadow-lg px-4 py-3 text-left max-w-sm"
              >
                <UserAvatar src={sender.image} name={sender.name} size="sm" />
                <span className="min-w-0">
                  <span className="block font-bold text-sm truncate">{sender.name}</span>
                  <span className="block text-sm text-base-content/70 truncate">
                    {event.message?.text || "Sent an attachment"}
                  </span>
                </span>
              </button>
            ),
            { duration: 5000 }
          );
        };

        // message.new covers channels we already watch; notification.message_new
        // fires for a channel the client is not watching yet (e.g. a first message)
        const presenceHandler = (event) => {
          const u = event.user;
          if (!u?.id || u.id === authUser._id) return;
          setPresenceByUser((prev) => ({
            ...prev,
            [u.id]: { online: Boolean(u.online), lastActive: u.last_active || null },
          }));
        };

        chatClient.on("message.new", handler);
        chatClient.on("notification.message_new", handler);
        chatClient.on("user.presence.changed", presenceHandler);
        chatClient.on("user.updated", presenceHandler);
        detach = () => {
          chatClient.off("message.new", handler);
          chatClient.off("notification.message_new", handler);
          chatClient.off("user.presence.changed", presenceHandler);
          chatClient.off("user.updated", presenceHandler);
        };
      } catch (error) {
        console.error("Could not connect to chat", error);
      }
    };

    start();

    return () => {
      cancelled = true;
      detach();
    };
  }, [authUser?._id, authUser?.fullName, authUser?.profilePic, tokenData?.token, navigate]);

  const value = useMemo(
    () => ({
      client: chatClient,
      ready,
      unreadByUser,
      totalUnread: Object.values(unreadByUser).reduce((a, b) => a + b, 0),
      presenceByUser,
      clearUnreadFor,
      setActiveChannel,
    }),
    [ready, unreadByUser, presenceByUser, clearUnreadFor, setActiveChannel]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
