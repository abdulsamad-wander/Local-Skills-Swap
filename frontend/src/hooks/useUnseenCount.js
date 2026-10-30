import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriendReq, markNotificationsSeen } from "../lib/api";
import useAuthUser from "./useAuthUser";

/**
 * Friend-request notifications that arrived after the user last opened the
 * notifications page. The "seen" timestamp lives on the server, so the badge
 * stays cleared after a refresh.
 */
export const useUnseenCount = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const { data } = useQuery({ queryKey: ["friendReqs"], queryFn: getFriendReq });

  const seenAt = authUser?.notificationsSeenAt ? new Date(authUser.notificationsSeenAt) : new Date(0);

  const items = [...(data?.incomingReqs || []), ...(data?.acceptedReqs || [])];
  const unseen = items.filter((i) => new Date(i.updatedAt || i.createdAt || 0) > seenAt).length;

  const { mutate: markSeen } = useMutation({
    mutationFn: markNotificationsSeen,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { unseen, markSeen };
};
