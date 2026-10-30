import { createContext, useContext } from "react";

export const ChatContext = createContext({
  client: null,
  ready: false,
  unreadByUser: {},
  totalUnread: 0,
  presenceByUser: {},
  clearUnreadFor: () => {},
  setActiveChannel: () => {},
});

export const useChat = () => useContext(ChatContext);

/** { online, lastActive } for a user id, safe when presence is unknown. */
export const usePresence = (userId) => {
  const { presenceByUser } = useChat();
  return presenceByUser[userId] || { online: false, lastActive: null };
};
