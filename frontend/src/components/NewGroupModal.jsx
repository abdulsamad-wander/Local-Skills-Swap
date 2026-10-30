import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IoClose, IoSearch, IoCheckmark } from "react-icons/io5";
import { createGroup, getFriends } from "../lib/api";
import UserAvatar from "./UserAvatar";
import AvatarUpload from "./AvatarUpload";

export const MAX_GROUP_MEMBERS = 100;

const NewGroupModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState([]);

  const { data: friends = [] } = useQuery({ queryKey: ["friends"], queryFn: getFriends, enabled: open });

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? friends.filter((f) => f.fullName.toLowerCase().includes(q)) : friends;
  }, [friends, query]);

  const { mutate: create, isPending } = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      toast.success("Group created");
      handleClose();
      navigate(`/group/${data.channelId}`);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not create the group. Please try again."),
  });

  const handleClose = () => {
    setName("");
    setImage("");
    setQuery("");
    setPicked([]);
    onClose();
  };

  const toggle = (id) =>
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      // the creator counts toward the limit too
      if (prev.length + 1 >= MAX_GROUP_MEMBERS) {
        toast.error(`A group holds ${MAX_GROUP_MEMBERS} people including you.`);
        return prev;
      }
      return [...prev, id];
    });

  if (!open) return null;

  const total = picked.length + 1;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-3xl bg-base-100 p-5 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold">New group</h2>
          <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle" aria-label="Close">
            <IoClose className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <AvatarUpload
            value={image}
            name={name || "Group"}
            onChange={setImage}
            size="lg"
            compact
            group
            label="Choose a group icon"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group name"
            maxLength={60}
            className="input input-bordered rounded-2xl flex-1"
          />
        </div>

        <div className="relative mt-3">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search friends"
            className="input input-bordered input-sm rounded-2xl w-full pl-10"
          />
        </div>

        <p className="text-xs text-base-content/60 mt-3">
          {total} of {MAX_GROUP_MEMBERS} people
        </p>

        <ul className="flex-1 overflow-y-auto mt-2 -mx-1 px-1 space-y-1">
          {shown.length === 0 && (
            <li className="text-sm text-base-content/60 py-6 text-center">
              {friends.length === 0 ? "Add some friends first." : "Nobody matches that name."}
            </li>
          )}
          {shown.map((f) => {
            const on = picked.includes(f._id);
            return (
              <li key={f._id}>
                <button
                  type="button"
                  onClick={() => toggle(f._id)}
                  className={`w-full flex items-center gap-3 rounded-2xl p-2.5 text-left ${
                    on ? "bg-primary/15" : "hover:bg-base-200"
                  }`}
                >
                  <UserAvatar src={f.profilePic} name={f.fullName} size="sm" />
                  <span className="flex-1 min-w-0 font-semibold truncate">{f.fullName}</span>
                  <span
                    className={`grid place-items-center size-6 rounded-full border-2 ${
                      on ? "bg-primary border-primary text-primary-content" : "border-base-300"
                    }`}
                  >
                    {on && <IoCheckmark className="size-4" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          className="btn btn-primary rounded-2xl mt-4"
          disabled={isPending || !name.trim() || picked.length === 0}
          onClick={() => create({ name, memberIds: picked, image })}
        >
          {isPending ? <span className="loading loading-spinner loading-sm" /> : `Create group (${total})`}
        </button>
      </div>
    </div>
  );
};

export default NewGroupModal;
