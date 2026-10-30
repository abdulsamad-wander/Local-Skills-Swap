import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { blockUser, getBlockStatus, unblockUser } from "../lib/api";

const EMPTY = { blocked: [], blockedBy: [] };

/**
 * Who you blocked and who blocked you, plus the two actions.
 * Blocking freezes the shared conversation on the server, so neither side
 * can send until it is lifted.
 */
export const useBlockStatus = () => {
  const queryClient = useQueryClient();
  const { data = EMPTY } = useQuery({ queryKey: ["blockStatus"], queryFn: getBlockStatus });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["blockStatus"] });
    queryClient.invalidateQueries({ queryKey: ["blocked"] });
    queryClient.invalidateQueries({ queryKey: ["friends"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const { mutate: block, isPending: blocking } = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      toast.success("Blocked. Neither of you can message the other.");
      refresh();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not block. Please try again."),
  });

  const { mutate: unblock, isPending: unblocking } = useMutation({
    mutationFn: unblockUser,
    onSuccess: (res) => {
      toast.success(
        res?.stillBlockedByThem ? "Unblocked. They still have you blocked." : "Unblocked. You can message again."
      );
      refresh();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not unblock. Please try again."),
  });

  return {
    iBlocked: (id) => data.blocked.includes(id),
    blockedMe: (id) => data.blockedBy.includes(id),
    isBlocked: (id) => data.blocked.includes(id) || data.blockedBy.includes(id),
    block,
    unblock,
    busy: blocking || unblocking,
  };
};
