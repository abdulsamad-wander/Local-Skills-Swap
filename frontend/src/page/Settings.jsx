import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoLocationOutline, IoCheckmark } from "react-icons/io5";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import { updateProfile } from "../lib/api";
import { LANGUAGES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import AvatarUpload from "../components/AvatarUpload";

const CHAT_THEMES = [
  { value: "match", label: "Match app theme", hint: "Follows your app theme" },
  { value: "light", label: "Always light", hint: "White background, dark text" },
  { value: "dark", label: "Always dark", hint: "Dark background, light text" },
];

const Settings = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const { logoutMutation } = useLogout();
  const { chatTheme, setChatTheme } = useThemeStore();

  const [form, setForm] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
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

      {/* APPEARANCE */}
      <section className="rounded-3xl bg-base-200 p-5 sm:p-6">
        <h3 className="font-extrabold text-lg">Appearance</h3>
        <p className="text-sm text-base-content/60 mt-0.5">Applies on this device.</p>

        <h4 className="font-bold text-sm mt-5 mb-2">Chat background</h4>
        <div className="grid sm:grid-cols-3 gap-3">
          {CHAT_THEMES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setChatTheme(c.value)}
              className={`flex items-center gap-3 rounded-2xl bg-base-100 p-4 text-left ring-2 ${
                chatTheme === c.value ? "ring-primary" : "ring-transparent hover:ring-base-300"
              }`}
            >
              <span
                className={`grid place-items-center size-10 rounded-xl shrink-0 ${
                  c.value === "dark"
                    ? "bg-neutral text-neutral-content"
                    : c.value === "light"
                      ? "bg-white text-neutral"
                      : "bg-base-200 text-base-content"
                }`}
              >
                {chatTheme === c.value ? <IoCheckmark className="size-5" /> : <span className="text-xs font-bold">Aa</span>}
              </span>
              <span>
                <span className="block font-bold">{c.label}</span>
                <span className="block text-xs text-base-content/60">{c.hint}</span>
              </span>
            </button>
          ))}
        </div>
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
