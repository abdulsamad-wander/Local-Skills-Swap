import { IoHomeOutline, IoHome, IoPeopleOutline, IoPeople, IoNotificationsOutline, IoNotifications } from "react-icons/io5";

export const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: IoHomeOutline, ActiveIcon: IoHome },
  { to: "/friends", label: "Friends", Icon: IoPeopleOutline, ActiveIcon: IoPeople },
  { to: "/notifications", label: "Notifications", Icon: IoNotificationsOutline, ActiveIcon: IoNotifications },
];
