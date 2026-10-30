import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { acceptFriendReqs, getFriendReq, getFriends } from "../lib/api";
import { useChat } from "../context/ChatContext";
import { useUnseenCount } from "../hooks/useUnseenCount";
import NoNotificationFound from "../components/NoNotificationFound";
import UserAvatar from "../components/UserAvatar";
import LanguagePair from "../components/LanguagePair";

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["friendReqs"], queryFn: getFriendReq });

  const { data: friends = [] } = useQuery({ queryKey: ["friends"], queryFn: getFriends });
  const { unreadByUser } = useChat();
  const { markSeen } = useUnseenCount();

  // opening this page clears the friend-request badge for good
  useEffect(() => {
    markSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unreadFriends = friends
    .map((f) => ({ ...f, unread: unreadByUser[f._id] || 0 }))
    .filter((f) => f.unread > 0);

  const { mutate: accept, isPending, variables: acceptingId } = useMutation({
    mutationFn: acceptFriendReqs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incoming = data?.incomingReqs || [];
  const accepted = data?.acceptedReqs || [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <h2 className="text-2xl font-extrabold tracking-tight">Notifications</h2>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-3xl" />)}
        </div>
      ) : incoming.length === 0 && accepted.length === 0 && unreadFriends.length === 0 ? (
        <NoNotificationFound />
      ) : (
        <>
          {unreadFriends.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-bold text-base-content/70">Messages</h3>
              {unreadFriends.map((f) => (
                <Link
                  key={f._id}
                  to={`/chat/${f._id}`}
                  className="rounded-3xl bg-base-200 p-4 flex items-center gap-4 hover:bg-base-300/60 transition-colors"
                >
                  <UserAvatar src={f.profilePic} name={f.fullName} size="md" unread={f.unread} />
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold truncate">{f.fullName}</p>
                    <p className="text-sm text-base-content/70">
                      {f.unread === 1 ? "Sent you a message" : `Sent you ${f.unread} messages`}
                    </p>
                  </div>
                  <IoChatbubbleEllipsesOutline className="size-5 text-base-content/50" />
                </Link>
              ))}
            </section>
          )}

          {incoming.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-bold text-base-content/70">
                Wants to connect <span className="badge badge-primary badge-sm ml-1">{incoming.length}</span>
              </h3>
              {incoming.map((r) => (
                <div key={r._id} className="rounded-3xl bg-base-200 p-4 flex items-center gap-4">
                  <UserAvatar src={r.sender?.profilePic} name={r.sender?.fullName} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold truncate">{r.sender?.fullName}</p>
                    <div className="mt-1">
                      <LanguagePair native={r.sender?.nativeLanguage} learning={r.sender?.learningLanguage} compact />
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm rounded-full"
                    onClick={() => accept(r._id)}
                    disabled={isPending}
                  >
                    {isPending && acceptingId === r._id ? <span className="loading loading-spinner loading-xs" /> : "Accept"}
                  </button>
                </div>
              ))}
            </section>
          )}

          {accepted.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-bold text-base-content/70">New connections</h3>
              {accepted.map((n) => (
                <div key={n._id} className="rounded-3xl bg-base-200 p-4 flex items-center gap-4">
                  <UserAvatar src={n.recipient?.profilePic} name={n.recipient?.fullName} size="md" online />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-extrabold">{n.recipient?.fullName}</span> accepted your request. Say hello.
                    </p>
                  </div>
                  <Link to={`/chat/${n.recipient?._id}`} className="btn btn-ghost btn-sm rounded-full gap-2">
                    <IoChatbubbleEllipsesOutline className="size-4" />
                    Chat
                  </Link>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
