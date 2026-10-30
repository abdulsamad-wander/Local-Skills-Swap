import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFriendReq } from "../lib/api";

/** Unseen notification count shared by the sidebar and the mobile tab bar. */
export const useUnseenCount = () => {
  const { pathname } = useLocation();
  const [lastViewed, setLastViewed] = useState(0);
  const { data } = useQuery({ queryKey: ["friendReqs"], queryFn: getFriendReq });
  const total = (data?.incomingReqs?.length || 0) + (data?.acceptedReqs?.length || 0);

  const onNotifications = pathname === "/notifications";
  if (onNotifications && lastViewed !== total) setLastViewed(total);

  return {
    unseen: onNotifications ? 0 : Math.max(0, total - lastViewed),
    markSeen: () => setLastViewed(total),
  };
};
