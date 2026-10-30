import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

/** One Stream client for the whole app. */
export const chatClient = StreamChat.getInstance(STREAM_API_KEY);

export const channelIdFor = (a, b) => [a, b].sort().join("-");

export const connectChatUser = async (user, token) => {
  if (chatClient.userID === user.id) return chatClient;
  if (chatClient.userID) await chatClient.disconnectUser();
  await chatClient.connectUser(user, token);
  return chatClient;
};

export const disconnectChatUser = async () => {
  if (chatClient.userID) await chatClient.disconnectUser();
};
