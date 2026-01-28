import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getSendRequests,
} from "../lib/api";
import { FaRegCheckCircle, FaUser } from "react-icons/fa";
import { Link } from "react-router";
import NoFriendsFound from "../components/NoFriendsFound";
import FriendCard from "../components/FriendCard";
import { FaMapMarkerAlt } from "react-icons/fa";
import getLanguageFlag from "../components/getLanguageFlag";
import { FiUserPlus } from "react-icons/fi";

const Home = () => {
  const queryClient = useQueryClient();
  const [requestId, setRequestId] = useState(new Set());
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });
  //another query for recommended users
  const { data: recommemdedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });
  //outgoing requests || Friend Requests that we have sent
  const { data: friendRequests = [] } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getOutgoingFriendReqs,
  });
  //sending requests || Requests that someone sent us
  const { mutate: sendRequests, isPending } = useMutation({
    mutationFn: getSendRequests,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] }),
  });

  useEffect(() => {
    const outgoingId = new Set();
    if (friendRequests && friendRequests.length > 0) {
      friendRequests.forEach((req) => {
        outgoingId.add(req.recipient._id);
      });
      setRequestId(outgoingId);
    }
  }, [friendRequests]);
  const Capitilize = (text = "") =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Your Friends
            </h2>
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <FaUser className="mr-2 size-4" />
              Friend Requests
            </Link>
          </div>
          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
          <section>
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Meet New Learners
                  </h2>
                  <p className="opacity-70">
                    Discover perfect skill exchange partners based on your
                    profile
                  </p>
                </div>
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : recommemdedUsers.length === 0 ? (
              <div className="card bg-base-200 p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">
                  No recommendations available
                </h3>
                <p className="text-base-content opacity-70">
                  Check back later for new skill partners!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommemdedUsers.map((user) => {
                  const hasRequestBeenSent = requestId.has(user._id);
                  return (
                    <div
                      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                      key={user._id}
                    >
                      <div className="card-body p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar size-16 rounded-full">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {user.fullName}
                            </h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <FaMapMarkerAlt className="size-3 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className="badge badge-secondary">
                            {getLanguageFlag(user.nativeLanguage)}
                            Native: {Capitilize(user.nativeLanguage)}
                          </span>
                          <span className="badge badge-outline">
                            {getLanguageFlag(user.learningLanguage)}
                            Learning: {Capitilize(user.learningLanguage)}
                          </span>
                        </div>

                        {user.bio && (
                          <p className="text-sm opacity-70">{user.bio}</p>
                        )}

                        {/* Action button */}
                        <button
                          className={`btn w-full mt-2 ${
                            hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                          } `}
                          onClick={() => sendRequests(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <FaRegCheckCircle className="size-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <FiUserPlus className="size-4 mr-2" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
