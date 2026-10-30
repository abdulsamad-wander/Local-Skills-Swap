import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getAvatar,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  markNotificationsSeen,
  sendFriendRequest,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

// public: avatars are loaded by <img> tags and by Stream, no cookie needed
router.get("/:id/avatar", getAvatar);

// everything below requires a logged-in user
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.put("/me", updateProfile);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);
router.put("/notifications/seen", markNotificationsSeen);

export default router;
