import crypto from "crypto";
import User from "../models/User.js";
import GroupImage from "../models/GroupImage.js";
import { absoluteUrl, parseImageDataUrl } from "../lib/profile.js";
import {
  MAX_GROUP_MEMBERS,
  addChannelMembers,
  createGroupChannel,
  generateStreamToken,
  queryChannelState,
  removeChannelMembers,
  updateChannelData,
  upsertStreamUsers,
} from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const idsOf = (list = []) => list.map((v) => v.toString());

const groupImageUrl = (req, channelId) =>
  absoluteUrl(req, `/api/chat/groups/${channelId}/image?v=${Date.now()}`);

/** Saves an uploaded icon and returns the URL Stream should store, or null. */
async function saveGroupImage(req, channelId, image) {
  if (image === "") {
    await GroupImage.deleteOne({ channelId });
    return "";
  }

  const parsed = parseImageDataUrl(image);
  if (!parsed) return null;

  await GroupImage.findOneAndUpdate(
    { channelId },
    { channelId, data: parsed.data, contentType: parsed.contentType },
    { upsert: true }
  );

  return groupImageUrl(req, channelId);
}

/** Members must be real, onboarded users who have not blocked each other. */
async function resolveMembers(currentUser, memberIds) {
  const unique = [...new Set(idsOf(memberIds))].filter((id) => id !== currentUser.id);

  const users = await User.find({ _id: { $in: unique } }).select("blockedUsers fullName profilePic");
  if (users.length !== unique.length) {
    const err = new Error("Some of those people could not be found");
    err.status = 400;
    throw err;
  }

  const myBlocked = idsOf(currentUser.blockedUsers);
  const blocked = users.filter(
    (u) => myBlocked.includes(u.id) || idsOf(u.blockedUsers).includes(currentUser.id)
  );
  if (blocked.length) {
    const err = new Error("You cannot add someone you have blocked");
    err.status = 400;
    throw err;
  }

  return { ids: unique, users };
}

export async function createGroup(req, res) {
  try {
    const { name, memberIds = [], image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Give the group a name" });
    }

    const { ids: members, users } = await resolveMembers(req.user, memberIds);
    if (!members.length) {
      return res.status(400).json({ message: "Add at least one other person" });
    }

    // Stream has no member cap of its own, so the limit is enforced here,
    // before anything is sent to Stream
    const total = members.length + 1;
    if (total > MAX_GROUP_MEMBERS) {
      return res.status(400).json({
        message: `A group can hold ${MAX_GROUP_MEMBERS} people. You tried to add ${total}.`,
      });
    }

    // a member Stream has never seen would make channel creation fail
    await upsertStreamUsers([...users, req.user]);

    const id = `group-${crypto.randomUUID()}`;
    const imageUrl = await saveGroupImage(req, id, image);

    await createGroupChannel({
      id,
      name: name.trim().slice(0, 60),
      createdById: req.user.id,
      memberIds: [req.user.id, ...members],
      image: imageUrl || "",
    });

    res.status(201).json({ success: true, channelId: id, memberCount: total });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("Error in createGroup controller", error.message);
    res.status(500).json({ message: "Could not create the group. Please try again." });
  }
}

/** Only members may change a group; only the creator may rename or remove others. */
async function loadGroup(channelId, userId) {
  const state = await queryChannelState(channelId);
  const memberIds = (state.members || []).map((m) => m.user_id);

  if (!memberIds.includes(userId)) {
    const err = new Error("You are not in this group");
    err.status = 403;
    throw err;
  }

  return { state, memberIds, createdBy: state.channel?.created_by?.id };
}

export async function addGroupMembers(req, res) {
  try {
    const { memberIds = [] } = req.body;
    const { memberIds: existing } = await loadGroup(req.params.id, req.user.id);

    const { ids, users } = await resolveMembers(req.user, memberIds);
    const toAdd = ids.filter((id) => !existing.includes(id));
    if (!toAdd.length) {
      return res.status(400).json({ message: "Those people are already in the group" });
    }

    const total = existing.length + toAdd.length;
    if (total > MAX_GROUP_MEMBERS) {
      return res.status(400).json({
        message: `A group can hold ${MAX_GROUP_MEMBERS} people. This one would have ${total}.`,
      });
    }

    await upsertStreamUsers(users.filter((u) => toAdd.includes(u._id.toString())));

    await addChannelMembers(req.params.id, toAdd, {
      text: `${req.user.fullName} added ${toAdd.length} ${toAdd.length === 1 ? "person" : "people"}`,
      user_id: req.user.id,
    });

    res.status(200).json({ success: true, memberCount: total });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("Error in addGroupMembers controller", error.message);
    res.status(500).json({ message: "Could not add those people. Please try again." });
  }
}

export async function removeGroupMember(req, res) {
  try {
    const { id, userId } = req.params;
    const { createdBy } = await loadGroup(id, req.user.id);

    if (userId !== req.user.id && createdBy !== req.user.id) {
      return res.status(403).json({ message: "Only the group creator can remove people" });
    }

    await removeChannelMembers(id, [userId], {
      text:
        userId === req.user.id
          ? `${req.user.fullName} left the group`
          : `${req.user.fullName} removed someone from the group`,
      user_id: req.user.id,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("Error in removeGroupMember controller", error.message);
    res.status(500).json({ message: "Could not update the group. Please try again." });
  }
}

export async function updateGroup(req, res) {
  try {
    const { name, image } = req.body;
    const { createdBy } = await loadGroup(req.params.id, req.user.id);

    if (createdBy !== req.user.id) {
      return res.status(403).json({ message: "Only the group creator can change it" });
    }

    const set = {};
    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: "Give the group a name" });
      set.name = name.trim().slice(0, 60);
    }
    if (image !== undefined) {
      const imageUrl = await saveGroupImage(req, req.params.id, image);
      if (imageUrl !== null) set.image = imageUrl;
    }

    if (!Object.keys(set).length) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    await updateChannelData(req.params.id, set);
    res.status(200).json({ success: true, ...set });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("Error in updateGroup controller", error.message);
    res.status(500).json({ message: "Could not rename the group. Please try again." });
  }
}

/** Public: serves a group icon, loaded by <img> tags and by Stream. */
export async function getGroupImage(req, res) {
  try {
    const image = await GroupImage.findOne({ channelId: req.params.id });
    if (!image?.data) return res.status(404).end();

    res.set("Content-Type", image.contentType || "image/jpeg");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(image.data);
  } catch (error) {
    console.error("Error in getGroupImage controller", error.message);
    res.status(500).end();
  }
}
