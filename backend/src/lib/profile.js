import User from "../models/User.js";
import { upsertStreamUser } from "./stream.js";

const DATA_URL_RE = /^data:(image\/(?:png|jpeg|jpg|webp));base64,([A-Za-z0-9+/=]+)$/;
const MAX_AVATAR_BYTES = 400 * 1024; // images are resized client-side to ~256px

/** Absolute URL for something this API serves, behind a proxy or not. */
export const absoluteUrl = (req, path) => {
  const host = req.get("x-forwarded-host") || req.get("host");
  const proto = req.get("x-forwarded-proto") || req.protocol;
  return `${proto}://${host}${path}`;
};

export const avatarUrlFor = (req, userId) =>
  absoluteUrl(req, `/api/users/${userId}/avatar?v=${Date.now()}`);

/**
 * Turns an uploaded data URL into bytes we can store.
 * Returns null when the value is not a data URL, throws when it is invalid.
 */
export const parseImageDataUrl = (value) => {
  const m = typeof value === "string" ? value.match(DATA_URL_RE) : null;
  if (!m) return null;

  const data = Buffer.from(m[2], "base64");
  if (data.length > MAX_AVATAR_BYTES) {
    const err = new Error("That image is too large. Please choose a smaller one.");
    err.status = 400;
    throw err;
  }

  return { data, contentType: m[1] === "image/jpg" ? "image/jpeg" : m[1] };
};

/**
 * Shared by onboarding and profile edit. Accepts only known fields.
 * profilePic may be an uploaded data URL (stored in Mongo) or an https URL.
 */
export async function applyProfileUpdate(req, userId, body) {
  const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = body;

  const update = {};
  if (typeof fullName === "string" && fullName.trim()) update.fullName = fullName.trim();
  if (typeof bio === "string") update.bio = bio.trim().slice(0, 280);
  if (typeof nativeLanguage === "string") update.nativeLanguage = nativeLanguage.toLowerCase();
  if (typeof learningLanguage === "string") update.learningLanguage = learningLanguage.toLowerCase();
  if (typeof location === "string") update.location = location.trim();

  if (typeof profilePic === "string" && profilePic) {
    const m = profilePic.match(DATA_URL_RE);
    if (m) {
      const buf = Buffer.from(m[2], "base64");
      if (buf.length > MAX_AVATAR_BYTES) {
        const err = new Error("Profile picture is too large. Please choose a smaller image.");
        err.status = 400;
        throw err;
      }
      update.avatar = { data: buf, contentType: m[1] === "image/jpg" ? "image/jpeg" : m[1] };
      update.profilePic = avatarUrlFor(req, userId);
    } else if (/^https?:\/\//.test(profilePic)) {
      update.profilePic = profilePic;
    } else {
      const err = new Error("Invalid profile picture");
      err.status = 400;
      throw err;
    }
  } else if (profilePic === "") {
    update.profilePic = "";
    update.avatar = { data: undefined, contentType: undefined };
  }

  return update;
}

export async function syncStreamUser(user) {
  try {
    await upsertStreamUser({
      id: user._id.toString(),
      name: user.fullName,
      image: user.profilePic || "",
    });
  } catch (error) {
    console.log("Error syncing Stream user:", error.message);
  }
}

export const findPublicUser = (id) => User.findById(id).select("-password");
