import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addGroupMembers,
  createGroup,
  getGroupImage,
  getStreamToken,
  removeGroupMember,
  updateGroup,
} from "../controllers/chat.controller.js";

const router = express.Router();

// public: group icons are loaded by <img> tags and by Stream, no cookie needed
router.get("/groups/:id/image", getGroupImage);

router.use(protectRoute);

router.get("/token", getStreamToken);

router.post("/groups", createGroup);
router.put("/groups/:id", updateGroup);
router.post("/groups/:id/members", addGroupMembers);
router.delete("/groups/:id/members/:userId", removeGroupMember);

export default router;
