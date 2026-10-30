import { IoPeopleOutline } from "react-icons/io5";

const NoFriendsFound = () => (
  <div className="rounded-3xl border-2 border-dashed border-base-300 p-8 text-center">
    <IoPeopleOutline className="size-10 mx-auto text-base-content/40" />
    <h3 className="font-extrabold text-lg mt-3">No friends yet</h3>
    <p className="text-base-content/60 mt-1">Send a request to someone below and start practising together.</p>
  </div>
);

export default NoFriendsFound;
