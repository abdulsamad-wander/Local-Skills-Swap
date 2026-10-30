import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { IoLocationOutline, IoPersonAddOutline, IoCheckmarkCircle, IoMailUnreadOutline } from "react-icons/io5";
import { getFriends, getFriendReq, getOutgoingFriendReqs, getRecommendedUsers, getSendRequests } from "../lib/api";
import UserAvatar from "../components/UserAvatar";
import LanguagePair from "../components/LanguagePair";

const Home = () => {
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({ queryKey: ["friends"], queryFn: getFriends });
  const { data: people = [], isLoading: loadingUsers } = useQuery({ queryKey: ["users"], queryFn: getRecommendedUsers });
  const { data: outgoing = [] } = useQuery({ queryKey: ["friendRequests"], queryFn: getOutgoingFriendReqs });
  const { data: friendReqs } = useQuery({ queryKey: ["friendReqs"], queryFn: getFriendReq });

  const { mutate: sendRequest, isPending, variables: pendingId } = useMutation({
    mutationFn: getSendRequests,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friendRequests"] }),
  });

  const requested = useMemo(() => {
    const s = new Set();
    (outgoing || []).forEach((r) => {
      const id = r.recipient?._id || r.recipient;
      if (id) s.add(id);
    });
    return s;
  }, [outgoing]);

  // people who already sent us a request: answer in notifications instead of sending another
  const incomingFrom = useMemo(() => {
    const s = new Set();
    (friendReqs?.incomingReqs || []).forEach((r) => {
      const id = r.sender?._id || r.sender;
      if (id) s.add(id);
    });
    return s;
  }, [friendReqs]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* friends strip */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-lg font-extrabold tracking-tight">Your friends</h2>
          {friends.length > 0 && (
            <Link to="/friends" className="text-sm font-semibold text-primary hover:underline">
              See all
            </Link>
          )}
        </div>
        {loadingFriends ? (
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton size-16 rounded-full" />)}
          </div>
        ) : friends.length === 0 ? (
          <p className="text-base-content/60">No friends yet. Say hi to someone below.</p>
        ) : (
          <ul className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
            {friends.map((f) => (
              <li key={f._id} className="shrink-0 w-[4.5rem] text-center">
                <Link to={`/chat/${f._id}`} className="block group">
                  <span className="block rounded-full p-[3px] bg-gradient-to-tr from-primary to-secondary group-hover:scale-105 transition-transform">
                    <UserAvatar src={f.profilePic} name={f.fullName} size="lg" className="ring-2 ring-base-100" />
                  </span>
                  <span className="block mt-1.5 text-xs font-semibold truncate">{f.fullName.split(" ")[0]}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* discover feed */}
      <section>
        <h2 className="text-2xl font-extrabold tracking-tight">People to practise with</h2>
        <p className="text-base-content/60 mt-1">Partners who speak what you're learning.</p>

        {loadingUsers ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-56 rounded-3xl" />)}
          </div>
        ) : people.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-base-300 p-10 text-center mt-6">
            <h3 className="font-extrabold text-lg">Nobody new right now</h3>
            <p className="text-base-content/60 mt-1">Check back soon, new learners join every day.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {people.map((u) => {
              const sent = requested.has(u._id);
              const wantsYou = incomingFrom.has(u._id);
              const sending = isPending && pendingId === u._id;
              return (
                <article key={u._id} className="person-card">
                  <div className="flex items-center gap-3">
                    <UserAvatar src={u.profilePic} name={u.fullName} size="lg" />
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-lg leading-tight truncate">{u.fullName}</h3>
                      {u.location && (
                        <p className="flex items-center gap-1 text-xs text-base-content/60 mt-0.5">
                          <IoLocationOutline className="size-3.5" />
                          <span className="truncate">{u.location}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <LanguagePair native={u.nativeLanguage} learning={u.learningLanguage} />

                  {u.bio && <p className="text-sm text-base-content/80 line-clamp-3">{u.bio}</p>}

                  {wantsYou ? (
                    <Link to="/notifications" className="btn btn-secondary rounded-full w-full mt-auto gap-2">
                      <IoMailUnreadOutline className="size-5" />
                      Wants to connect. Respond
                    </Link>
                  ) : (
                  <button
                    className={`btn rounded-full w-full mt-auto gap-2 ${sent ? "btn-ghost bg-base-300/60" : "btn-primary"}`}
                    onClick={() => sendRequest(u._id)}
                    disabled={sent || sending}
                  >
                    {sending ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : sent ? (
                      <>
                        <IoCheckmarkCircle className="size-5" />
                        Request sent
                      </>
                    ) : (
                      <>
                        <IoPersonAddOutline className="size-5" />
                        Connect
                      </>
                    )}
                  </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
