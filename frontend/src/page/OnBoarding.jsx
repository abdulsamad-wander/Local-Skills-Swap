import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { IoLocationOutline } from "react-icons/io5";
import useAuthUser from "../hooks/useAuthUser";
import { onBordingFn } from "../lib/api";
import { LANGUAGES } from "../constants/index.js";
import { useThemeStore } from "../store/useThemeStore";
import Logo from "../components/Logo";
import AvatarUpload from "../components/AvatarUpload";
import LanguagePair from "../components/LanguagePair";

const OnBoarding = () => {
  const { authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const [form, setForm] = useState({
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const queryClient = useQueryClient();
  const { mutate: onBoardingMutation, isPending } = useMutation({
    mutationFn: onBordingFn,
    onSuccess: () => {
      toast.success("Profile saved. Welcome in!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Could not save your profile. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onBoardingMutation(form);
  };

  const field = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen bg-base-100" data-theme={theme}>
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <Logo />
        <h1 className="text-3xl font-extrabold tracking-tight mt-8">Set up your profile</h1>
        <p className="text-base-content/60 mt-1">This is what partners see before they say hi.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 sm:grid-cols-[auto,1fr]">
          <div className="person-card sm:w-56 h-fit items-center text-center">
            <AvatarUpload
              value={form.profilePic}
              name={authUser?.fullName}
              onChange={(profilePic) => setForm((f) => ({ ...f, profilePic }))}
            />
            <div>
              <p className="font-extrabold">{authUser?.fullName}</p>
              <p className="text-xs text-base-content/60">{form.location || "Your city"}</p>
            </div>
            <LanguagePair native={form.nativeLanguage} learning={form.learningLanguage} compact />
          </div>

          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="form-control">
                <span className="label-text font-semibold mb-1.5">I speak</span>
                <select value={form.nativeLanguage} onChange={field("nativeLanguage")} className="select select-bordered rounded-2xl" required>
                  <option value="">Choose a language</option>
                  {LANGUAGES.map((l) => (
                    <option key={`n-${l}`} value={l.toLowerCase()}>{l}</option>
                  ))}
                </select>
              </label>
              <label className="form-control">
                <span className="label-text font-semibold mb-1.5">I'm learning</span>
                <select value={form.learningLanguage} onChange={field("learningLanguage")} className="select select-bordered rounded-2xl" required>
                  <option value="">Choose a language</option>
                  {LANGUAGES.map((l) => (
                    <option key={`l-${l}`} value={l.toLowerCase()}>{l}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="form-control">
              <span className="label-text font-semibold mb-1.5">Where are you based?</span>
              <div className="relative">
                <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-base-content/50" />
                <input
                  type="text"
                  value={form.location}
                  onChange={field("location")}
                  className="input input-bordered rounded-2xl w-full pl-11"
                  placeholder="City, country"
                  required
                />
              </div>
            </label>

            <label className="form-control">
              <span className="label-text font-semibold mb-1.5">About you</span>
              <textarea
                value={form.bio}
                onChange={field("bio")}
                className="textarea textarea-bordered rounded-2xl h-28 text-base"
                placeholder="What do you want to practise, and what are you into?"
                maxLength={280}
                required
              />
              <span className="label-text-alt text-base-content/50 mt-1 self-end">{form.bio.length}/280</span>
            </label>

            <button className="btn btn-primary rounded-2xl w-full" disabled={isPending} type="submit">
              {isPending ? <span className="loading loading-spinner loading-sm" /> : "Finish and find partners"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnBoarding;
