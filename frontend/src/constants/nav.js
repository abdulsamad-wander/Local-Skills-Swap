import {
  IoHomeOutline, IoHome,
  IoChatbubbleEllipsesOutline, IoChatbubbleEllipses,
  IoPeopleOutline, IoPeople,
  IoNotificationsOutline, IoNotifications,
  IoSettingsOutline, IoSettings,
} from "react-icons/io5";

export const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: IoHomeOutline, ActiveIcon: IoHome },
  { to: "/chats", label: "Chats", Icon: IoChatbubbleEllipsesOutline, ActiveIcon: IoChatbubbleEllipses, badge: "chat" },
  { to: "/friends", label: "Friends", Icon: IoPeopleOutline, ActiveIcon: IoPeople },
  { to: "/notifications", label: "Notifications", Icon: IoNotificationsOutline, ActiveIcon: IoNotifications, badge: "requests" },
  { to: "/settings", label: "Settings", Icon: IoSettingsOutline, ActiveIcon: IoSettings },
];
