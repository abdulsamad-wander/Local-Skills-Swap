import { upsertStreamUser } from "../lib/stream.js";
import { applyProfileUpdate, syncStreamUser } from "../lib/profile.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

// Never send the password hash back to the client
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a different one" });
    }

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: "",
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ success: true, user: sanitizeUser(newUser) });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt", baseCookieOptions);
  res.status(200).json({ success: true, message: "Logout successful" });
}

export function getUser(req, res) {
  res.status(200).json({ success: true, user: req.user });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { bio, nativeLanguage, learningLanguage, location } = req.body;

    const missingFields = [
      !bio && "bio",
      !nativeLanguage && "nativeLanguage",
      !learningLanguage && "learningLanguage",
      !location && "location",
    ].filter(Boolean);

    if (missingFields.length) {
      return res.status(400).json({ message: "All fields are required", missingFields });
    }

    const update = await applyProfileUpdate(req, userId, req.body);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...update, isOnboarded: true },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    await syncStreamUser(updatedUser);

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
