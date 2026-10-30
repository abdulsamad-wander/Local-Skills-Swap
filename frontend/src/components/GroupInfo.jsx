import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IoClose, IoPersonRemove, IoExit, IoPersonAdd, IoCheckmark } from "react-icons/io5";
import useAuthUser from "../hooks/useAuthUser";
import { addGroupMembers, getFriends, removeGroupMember, updateGroup } from "../lib/api";
import { MAX_GROUP_MEMBERS } from "./NewGroupModal";
import UserAvatar from "./UserAvatar";
import AvatarUpload from "./AvatarUpload";
import GroupAvatar from "./GroupAvatar";
import PresenceLabel from "./PresenceDot";

const GroupInfo = ({ channel, open, onClose }) => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState(channel?.data?.name || "");
  const [image, setImage] = useState(channel?.data?.image || "");
  const [adding, setAdding] = useState(false);
  const [picked, setPicked] = useState([]);

  // channel.state mutates in place, so read it each render rather than memoising
  const members = Object.values(channel?.state?.members || {});
  const memberIds = members.map((m) => m.user_id);
  const createdBy = channel?.data?.created_by?.id;
  const isOwner = createdBy === authUser?._id;

  const { data: friends = [] } = useQuery({ queryKey: ["friends"], queryFn: getFriends, enabled: adding });
  const addable = friends.filter((f) => !memberIds.includes(f._id));

  const after = (msg) => () => {
    toast.success(msg);
    queryClient.invalidateQueries({ queryKey: ["channels"] });
  };
  const onFail = (error) =>
    toast.error(error.response?.data?.message || "Could not update the group. Please try again.");

  const { mutate: saveGroup, isPending: saving } = useMutation({
    mutationFn: updateGroup,
    onSuccess: after("Group updated"),
    onError: onFail,
  });

  const { mutate: addMembers, isPending: addingMembers } = useMutation({
    mutationFn: addGroupMembers,
    onSuccess: () => {
      toast.success("People added");
      setPicked([]);
      setAdding(false);
    },
    onError: onFail,
  });

  const { mutate: removeMember } = useMutation({
    mutationFn: removeGroupMember,
    onSuccess: after("Group updated"),
    onError: onFail,
  });

  const { mutate: leave, isPending: leaving } = useMutation({
    mutationFn: removeGroupMember,
    onSuccess: () => {
      toast.success("You left the group");
      navigate("/chats");
    },
    onError: onFail,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" role="dialog" aria-modal="true">
      <aside className="w-full max-w-sm bg-base-100 h-full overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold">Group info</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle" aria-label="Close">
            <IoClose className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {isOwner ? (
            <AvatarUpload
              value={image}
              name={name || "Group"}
              onChange={setImage}
              size="lg"
              compact
              group
              label="Choose a group icon"
            />
          ) : (
            <GroupAvatar src={channel.data?.image} name={name} size="lg" />
          )}
          <label className="form-control flex-1">
            <span className="label-text font-semibold mb-1.5">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isOwner}
              maxLength={60}
              className="input input-bordered rounded-2xl w-full"
            />
          </label>
        </div>

        {isOwner ? (
          <button
            className="btn btn-primary rounded-2xl w-full mt-3"
            disabled={
              saving ||
              !name.trim() ||
              (name === channel.data?.name && image === (channel.data?.image || ""))
            }
            onClick={() => saveGroup({ channelId: channel.id, name, image })}
          >
            {saving ? <span className="loading loading-spinner loading-sm" /> : "Save changes"}
          </button>
        ) : (
          <p className="text-xs text-base-content/50 mt-2">
            Only the person who made the group can change its name or icon.
          </p>
        )}

        <div className="flex items-center justify-between mt-6 mb-2">
          <h3 className="font-bold text-sm">
            {members.length} of {MAX_GROUP_MEMBERS} members
          </h3>
          <button onClick={() => setAdding((a) => !a)} className="btn btn-ghost btn-xs rounded-full gap-1">
            <IoPersonAdd className="size-4" />
            {adding ? "Done" : "Add"}
          </button>
        </div>

        {adding && (
          <div className="rounded-2xl bg-base-200 p-3 mb-3">
            {addable.length === 0 ? (
              <p className="text-sm text-base-content/60">All of your friends are already here.</p>
            ) : (
              <>
                <ul className="max-h-48 overflow-y-auto space-y-1">
                  {addable.map((f) => {
                    const on = picked.includes(f._id);
                    return (
                      <li key={f._id}>
                        <button
                          type="button"
                          onClick={() =>
                            setPicked((p) => (on ? p.filter((x) => x !== f._id) : [...p, f._id]))
                          }
                          className={`w-full flex items-center gap-2.5 rounded-xl p-2 text-left ${
                            on ? "bg-primary/15" : "hover:bg-base-300/60"
                          }`}
                        >
                          <UserAvatar src={f.profilePic} name={f.fullName} size="sm" />
                          <span className="flex-1 min-w-0 text-sm font-semibold truncate">{f.fullName}</span>
                          {on && <IoCheckmark className="size-4 text-primary" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <button
                  className="btn btn-primary btn-sm rounded-full w-full mt-2"
                  disabled={addingMembers || picked.length === 0}
                  onClick={() => addMembers({ channelId: channel.id, memberIds: picked })}
                >
                  Add {picked.length || ""}
                </button>
              </>
            )}
          </div>
        )}

        <ul className="space-y-1">
          {members.map((m) => (
            <li key={m.user_id} className="flex items-center gap-3 rounded-2xl p-2">
              <UserAvatar src={m.user?.image} name={m.user?.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">
                  {m.user?.name}
                  {m.user_id === authUser?._id && " (you)"}
                  {m.user_id === createdBy && (
                    <span className="badge badge-ghost badge-xs ml-2 align-middle">Creator</span>
                  )}
                </p>
                <PresenceLabel userId={m.user_id} className="text-xs" />
              </div>
              {isOwner && m.user_id !== authUser?._id && (
                <button
                  onClick={() => removeMember({ channelId: channel.id, userId: m.user_id })}
                  className="btn btn-ghost btn-xs btn-circle"
                  title="Remove from group"
                  aria-label={`Remove ${m.user?.name}`}
                >
                  <IoPersonRemove className="size-4" />
                </button>
              )}
            </li>
          ))}
        </ul>

        <button
          onClick={() => leave({ channelId: channel.id, userId: authUser._id })}
          disabled={leaving}
          className="btn btn-outline btn-error rounded-2xl w-full mt-6 gap-2"
        >
          <IoExit className="size-5" />
          Leave group
        </button>
      </aside>
    </div>
  );
};

export default GroupInfo;
