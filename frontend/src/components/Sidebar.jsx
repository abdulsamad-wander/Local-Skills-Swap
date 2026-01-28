import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import { GiShipWheel } from "react-icons/gi";
import { IoIosHome } from "react-icons/io";
import { FaUserAstronaut } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { getFriendReq } from "../lib/api";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currPath = location.pathname;
  const { data: friendReqs } = useQuery({
    queryKey: ["friendReqs"],
    queryFn: getFriendReq,
  });
  const incomingReqts = friendReqs?.incomingReqs || [];
  const acceptedReqts = friendReqs?.acceptedReqs || [];
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex md:flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-base-300">
        <Link to={"/"} className="flex items-center gap-2">
          <GiShipWheel className="size-8 text-primary animate-spin" />
          <span className="text-2xl font-bold font-mono bg-clip-text tracking-wider text-blue-500">
            Speak<span className="text-yellow-500">Zen</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currPath === "/" ? "btn-active" : ""
          }`}
        >
          <IoIosHome className="size-4 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <FaUserAstronaut className="size-4 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <FaBell className="size-4 text-base-content opacity-70" />
          <span>Notifications</span>

          {incomingReqts.length + acceptedReqts.length > 0 && (
            <span className="badge badge-primary ml-2">
              {(incomingReqts.length + acceptedReqts.length) > 9 ? "9+" : (incomingReqts.length + acceptedReqts.length)}
            </span>
          )}
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img src={authUser?.profilePic || ""} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-xs">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
