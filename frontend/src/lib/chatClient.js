import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

/** One Stream client for the whole app. */
export const chatClient = StreamChat.getInstance(STREAM_API_KEY);

export const channelIdFor = (a, b) => [a, b].sort().join("-");

export const isGroupChannel = (channel) =>
  Boolean(channel?.data?.isGroup) || Object.keys(channel?.state?.members || {}).length > 2;

/** The other person in a one to one channel. */
export const otherMemberOf = (channel, myId) =>
  Object.values(channel?.state?.members || {}).find((m) => m.user_id !== myId)?.user;

export const connectChatUser = async (user, token) => {
  if (chatClient.userID === user.id) return chatClient;
  if (chatClient.userID) await chatClient.disconnectUser();
  await chatClient.connectUser(user, token);
  return chatClient;
};

export const disconnectChatUser = async () => {
  if (chatClient.userID) await chatClient.disconnectUser();
};
