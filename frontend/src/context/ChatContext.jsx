import { createContext, useContext } from "react";

export const ChatContext = createContext({
  client: null,
  ready: false,
  unreadByUser: {},
  totalUnread: 0,
  clearUnreadFor: () => {},
});

export const useChat = () => useContext(ChatContext);
