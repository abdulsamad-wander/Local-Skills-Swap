import {
  IoHomeOutline, IoHome,
  IoPeopleOutline, IoPeople,
  IoNotificationsOutline, IoNotifications,
  IoSettingsOutline, IoSettings,
} from "react-icons/io5";

export const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: IoHomeOutline, ActiveIcon: IoHome },
  { to: "/friends", label: "Friends", Icon: IoPeopleOutline, ActiveIcon: IoPeople, badge: "chat" },
  { to: "/notifications", label: "Notifications", Icon: IoNotificationsOutline, ActiveIcon: IoNotifications, badge: "requests" },
  { to: "/settings", label: "Settings", Icon: IoSettingsOutline, ActiveIcon: IoSettings },
];
