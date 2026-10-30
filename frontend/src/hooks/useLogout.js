import { logout } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      // Disconnect the shared Stream chat client so the next login starts clean
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        if (client.userID) await client.disconnectUser();
      } catch {
        // ignore, user is logging out anyway
      }
      queryClient.removeQueries({ queryKey: ["streamToken"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  return { logoutMutation, isPending, error };
};

export default useLogout;
