import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getFriends,
  getOutgoingFriendReqs,
} from "../lib/api";
import {  FaUser } from "react-icons/fa";
import { Link } from "react-router";
import NoFriendsFound from "../components/NoFriendsFound";
import FriendCard from "../components/FriendCard";

const Friends = () => {
  const [requestId, setRequestId] = useState(new Set());
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });
  //outgoing requests || Friend Requests that we have sent
  const { data: friendRequests = [] } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getOutgoingFriendReqs,
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
        </div>
      </div>
    </>
  );
};

export default Friends;
