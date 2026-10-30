import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoLocationOutline, IoBan } from "react-icons/io5";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import { getBlockedUsers, unblockUser, updateProfile } from "../lib/api";
import { LANGUAGES } from "../constants";
import AvatarUpload from "../components/AvatarUpload";
import UserAvatar from "../components/UserAvatar";

const Settings = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const { logoutMutation } = useLogout();

  const [form, setForm] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { data: blocked = [] } = useQuery({ queryKey: ["blocked"], queryFn: getBlockedUsers });

  const { mutate: unblock } = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      toast.success("Unblocked");
      queryClient.invalidateQueries({ queryKey: ["blocked"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Could not unblock. Please try again."),
  });

  const { mutate: save, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Could not save your changes. Please try again."),
  });

  const field = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    save(form);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      <header>
        <h2 className="text-2xl font-extrabold tracking-tight">Settings</h2>
        <p className="text-base-content/60 mt-1">Your profile and how the app looks.</p>
      </header>

      {/* PROFILE */}
      <section className="rounded-3xl bg-base-200 p-5 sm:p-6">
        <h3 className="font-extrabold text-lg">Profile</h3>
        <p className="text-sm text-base-content/60 mt-0.5">Partners see this before they message you.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-6 sm:grid-cols-[auto,1fr]">
          <AvatarUpload
            value={form.profilePic}
            name={form.fullName}
            onChange={(profilePic) => setForm((f) => ({ ...f, profilePic }))}
          />

          <div className="space-y-4">
            <label className="form-control">
              <span className="label-text font-semibold mb-1.5">Display name</span>
              <input
                type="text"
                value={form.fullName}
                onChange={field("fullName")}
                className="input input-bordered rounded-2xl bg-base-100"
                required
              />
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="form-control">
                <span className="label-text font-semibold mb-1.5">I speak</span>
                <select value={form.nativeLanguage} onChange={field("nativeLanguage")} className="select select-bordered rounded-2xl bg-base-100">
                  <option value="">Choose a language</option>
                  {LANGUAGES.map((l) => (
                    <option key={`n-${l}`} value={l.toLowerCase()}>{l}</option>
                  ))}
                </select>
              </label>
              <label className="form-control">
                <span className="label-text font-semibold mb-1.5">I'm learning</span>
                <select value={form.learningLanguage} onChange={field("learningLanguage")} className="select select-bordered rounded-2xl bg-base-100">
                  <option value="">Choose a language</option>
                  {LANGUAGES.map((l) => (
                    <option key={`l-${l}`} value={l.toLowerCase()}>{l}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="form-control">
              <span className="label-text font-semibold mb-1.5">Location</span>
              <div className="relative">
                <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-base-content/50" />
                <input
                  type="text"
                  value={form.location}
                  onChange={field("location")}
                  className="input input-bordered rounded-2xl bg-base-100 w-full pl-11"
                  placeholder="City, country"
                />
              </div>
            </label>

            <label className="form-control">
              <span className="label-text font-semibold mb-1.5">About you</span>
              <textarea
                value={form.bio}
                onChange={field("bio")}
                className="textarea textarea-bordered rounded-2xl bg-base-100 h-28 text-base"
                placeholder="What do you want to practise, and what are you into?"
                maxLength={280}
              />
              <span className="label-text-alt text-base-content/50 mt-1 self-end">{form.bio.length}/280</span>
            </label>

            <button type="submit" className="btn btn-primary rounded-2xl" disabled={isPending}>
              {isPending ? <span className="loading loading-spinner loading-sm" /> : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      {/* BLOCKED */}
      <section className="rounded-3xl bg-base-200 p-5 sm:p-6">
        <h3 className="font-extrabold text-lg">Blocked people</h3>
        <p className="text-sm text-base-content/60 mt-0.5">
          They cannot message you or send you a request, and you will not see each other in Discover.
        </p>

        {blocked.length === 0 ? (
          <div className="flex items-center gap-3 mt-4 text-base-content/60">
            <IoBan className="size-5" />
            <p className="text-sm">You have not blocked anyone.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {blocked.map((u) => (
              <li key={u._id} className="flex items-center gap-3 rounded-2xl bg-base-100 p-3">
                <UserAvatar src={u.profilePic} name={u.fullName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">{u.fullName}</p>
                  {u.location && <p className="text-xs text-base-content/60 truncate">{u.location}</p>}
                </div>
                <button onClick={() => unblock(u._id)} className="btn btn-ghost btn-sm rounded-full">
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ACCOUNT */}
      <section className="rounded-3xl bg-base-200 p-5 sm:p-6">
        <h3 className="font-extrabold text-lg">Account</h3>
        <p className="text-sm text-base-content/60 mt-0.5">Signed in as {authUser?.email}</p>
        <button onClick={() => logoutMutation()} className="btn btn-outline rounded-2xl mt-4">
          Log out
        </button>
      </section>
    </div>
  );
};

export default Settings;
