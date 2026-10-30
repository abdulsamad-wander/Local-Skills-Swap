import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { IoMailUnreadOutline } from "react-icons/io5";
import { getFriends } from "../lib/api";
import NoFriendsFound from "../components/NoFriendsFound";
import FriendCard from "../components/FriendCard";

const Friends = () => {
  const { data: friends = [], isLoading } = useQuery({ queryKey: ["friends"], queryFn: getFriends });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Friends</h2>
          <p className="text-base-content/60 mt-1">
            {friends.length === 1 ? "1 partner" : `${friends.length} partners`} you can message any time.
          </p>
        </div>
        <Link to="/notifications" className="btn btn-outline btn-sm rounded-full gap-2">
          <IoMailUnreadOutline className="size-4" />
          Requests
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-44 rounded-3xl" />)}
        </div>
      ) : friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((f) => <FriendCard key={f._id} friend={f} />)}
        </div>
      )}
    </div>
  );
};

export default Friends;
