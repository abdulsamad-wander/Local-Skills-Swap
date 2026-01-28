import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriendReq, logout } from "../lib/api";
import { GiShipWheel } from "react-icons/gi";
import { FaBell } from "react-icons/fa";
import ThemeSelector from "./ThemeSelector";
import { CiBellOn, CiLogout } from "react-icons/ci";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();
  const { data: friendReqs } = useQuery({
    queryKey: ["friendReqs"],
    queryFn: getFriendReq,
  });
  const incomingReqts = friendReqs?.incomingReqs || [];
  const acceptedReqts = friendReqs?.acceptedReqs || [];
  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to={"/"} className="flex items-center gap-2">
                <GiShipWheel className="size-8 text-primary animate-spin" />
                <span className="text-2xl font-bold font-mono bg-clip-text tracking-wider text-blue-500">
                  Speak<span className="text-yellow-500">Zen</span>
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center">
            <Link to={"/notifications"} className="relative">
              <button className="btn btn-ghost btn-circle relative">
                <FaBell  className="h-6 w-6 text-base-content opacity-70" />

                {/* Badge */}
                {incomingReqts.length + acceptedReqts.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center leading-none">
                    {(incomingReqts.length + acceptedReqts.length) > 9 ? "9+" : (incomingReqts.length + acceptedReqts.length)}
                  </span>
                )}
              </button>
            </Link>
          </div>

          {/* TODO */}
          <ThemeSelector />

          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src={authUser?.profilePic || ""}
                alt="User Avatar"
                rel="noreferrer"
              />
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <CiLogout className="h-5 w-5 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
