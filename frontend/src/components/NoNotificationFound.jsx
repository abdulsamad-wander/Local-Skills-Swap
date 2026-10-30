import { IoNotificationsOffOutline } from "react-icons/io5";

const NoNotificationFound = () => (
  <div className="rounded-3xl border-2 border-dashed border-base-300 p-10 text-center">
    <IoNotificationsOffOutline className="size-10 mx-auto text-base-content/40" />
    <h3 className="font-extrabold text-lg mt-3">You're all caught up</h3>
    <p className="text-base-content/60 mt-1">Friend requests and new connections will show up here.</p>
  </div>
);

export default NoNotificationFound;
