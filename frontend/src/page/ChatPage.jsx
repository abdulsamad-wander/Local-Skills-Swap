import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { useChat } from "../context/ChatContext";
import { channelIdFor } from "../lib/chatClient";
import { useThemeStore } from "../store/useThemeStore";
import { DARK_THEMES } from "../constants";
import ChatLoader from "../components/ChatLoader.jsx";
import CallButton from "../components/CallButton.jsx";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthUser();
  const { client, ready, clearUnreadFor, setActiveChannel } = useChat();
  const { theme, chatTheme } = useThemeStore();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !authUser?._id || !targetUserId) return;

    let cancelled = false;

    const openChannel = async () => {
      setLoading(true);
      try {
        const currChannel = client.channel("messaging", channelIdFor(authUser._id, targetUserId), {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();
        await currChannel.markRead().catch(() => {});
        if (cancelled) return;

        setChannel(currChannel);
        setActiveChannel(currChannel.cid);
        clearUnreadFor(targetUserId);
      } catch (error) {
        if (cancelled) return;
        console.error("Error opening chat", error);
        toast.error("Could not open this conversation. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    openChannel();

    return () => {
      cancelled = true;
      setActiveChannel(null);
    };
  }, [ready, client, authUser?._id, targetUserId, clearUnreadFor, setActiveChannel]);

  // mark as read while the conversation is open
  useEffect(() => {
    if (!channel) return;
    const handler = () => {
      channel.markRead().catch(() => {});
      clearUnreadFor(targetUserId);
    };
    channel.on("message.new", handler);
    return () => channel.off("message.new", handler);
  }, [channel, targetUserId, clearUnreadFor]);

  const handleVideoCall = async () => {
    if (!channel) return;
    const callURL = `${window.location.origin}/call/${channel.id}`;
    try {
      await channel.sendMessage({ text: `I started a video call. Join me here: ${callURL}` });
      window.open(callURL, "_blank", "noopener");
      toast.success("Call started. The link is in the chat.");
    } catch (err) {
      console.error(err);
      toast.error("Could not start the call. Please try again.");
    }
  };

  if (loading || !channel) return <ChatLoader />;

  // In "match" mode the chat inherits the app theme: pick the matching base
  // skin, then str-chat--app-theme remaps Stream's palette to the theme tokens.
  const matchesApp = chatTheme === "match";
  const baseSkin = matchesApp ? (DARK_THEMES.has(theme) ? "dark" : "light") : chatTheme;
  const chatClass = `str-chat__theme-${baseSkin}${matchesApp ? " str-chat--app-theme" : ""}`;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-base-100">
      <Chat client={client} theme={chatClass}>
        <Channel channel={channel}>
          <div className="flex-1 min-h-0 flex relative">
            <div className="absolute right-4 top-3 z-10">
              <CallButton handleVideoCall={handleVideoCall} />
            </div>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
