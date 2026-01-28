import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendReqs, getFriendReq } from "../lib/api";
import { FiUserCheck } from "react-icons/fi";
import { LuMessageSquare } from "react-icons/lu";
import { GoClock } from "react-icons/go";
import { FaRegBell } from "react-icons/fa";
import NoNotificationFound from "../components/NoNotificationFound";

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data: friendReqs, isLoading } = useQuery({
    queryKey: ["friendReqs"],
    queryFn: getFriendReq,
  });

  const { mutate: acceptMutation, isPending } = useMutation({
    mutationFn: acceptFriendReqs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingReqts = friendReqs?.incomingReqs || [];
  const acceptedReqts = friendReqs?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            {/* INCOMING FRIEND REQUESTS */}
            {incomingReqts.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiUserCheck className="h-4 w-4 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingReqts.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingReqts.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img
                                src={request?.sender?.profilePic}
                                alt={request?.sender?.fullName}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request?.sender?.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {request?.sender?.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {request?.sender?.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQUESTS */}
            {acceptedReqts.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaRegBell className="w-4 h-4 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedReqts.map((notification) => (
                    <div
                      className="card bg-base-200 shadow-sm"
                      key={notification._id}
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification?.recipient?.profilePic}
                              alt={notification?.recipient?.fullName}
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification?.recipient?.fullName}
                            </h3>
                            <p className="text-sm my-1">
                              {notification?.recipient?.fullName} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <GoClock className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>

                          <div className="badge badge-success">
                            <LuMessageSquare className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
        {incomingReqts.length === 0 && acceptedReqts.length === 0 && (
          <NoNotificationFound/>
        )}
      </div>
    </div>
  );
};

export default Notifications;
