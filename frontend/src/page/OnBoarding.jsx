import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { onBordingFn } from "../lib/api";
import { LANGUAGES } from "../constants/index.js";
import { FaCameraRetro } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { LuLoader, LuMapPin, LuShipWheel } from "react-icons/lu";

const OnBoarding = () => {
  const { authUser } = useAuthUser();

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
      toast.success("Profile OnBoarded Successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onBoardingMutation(form);
  };
  const handleRandomAvator = () => {
    const idx = Math.floor(Math.random() * 70) + 1; // 1-100 included
    const randomAvatar = `https://i.pravatar.cc/300?img=${idx}`;

    setForm({ ...form, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backgroundBlendMode: "darken",
      }}
    >
      <div
        className="rounded-md shadow-lg max-w-2xl w-full py-4 px-2"
        data-theme="coffee"
      >
        <div className="card  max-w-3xl shadow-xl">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-center mb-3">
              Complete Your Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PROFILE PIC CONTAINER */}
              <div className="flex flex-col items-center justify-center space-y-3">
                {/* IMAGE PREVIEW */}
                <div className="size-28 rounded-full bg-base-300 overflow-hidden">
                  {form.profilePic ? (
                    <img
                      src={form.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FaCameraRetro className="size-8 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                {/* Generate Random Avatar BTN */}
                <div className="flex items-center text-sm font-medium">
                  <button
                    type="button"
                    onClick={handleRandomAvator}
                    className="btn btn-accent"
                  >
                    <FaShuffle className="size-3" />
                    Generate Avatar
                  </button>
                </div>
              </div>

              {/* BIO */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="textarea textarea-bordered h-16 rounded-sm"
                  placeholder="Tell others about yourself and your language learning goals"
                />
              </div>

              {/* LANGUAGES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NATIVE LANGUAGE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={form.nativeLanguage}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nativeLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full h-10 rounded-sm"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* LEARNING LANGUAGE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={form.learningLanguage}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        learningLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full h-10 rounded-sm"
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option
                        key={`learning-${lang}`}
                        value={lang.toLowerCase()}
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <LuMapPin className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="input input-bordered w-full pl-10 h-10 rounded-sm"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}

              <button
                className="btn btn-primary w-full h-10 rounded-md"
                disabled={isPending}
                type="submit"
              >
                {!isPending ? (
                  <>
                    <LuShipWheel className="size-5 mr-2" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    <LuLoader className="animate-spin size-5 mr-2" />
                    Onboarding...
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
