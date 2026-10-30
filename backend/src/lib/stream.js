import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing in environment variables");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

/**
 * Make sure every member exists in Stream before they are put in a channel.
 * Stream accepts at most 100 users per request, so send them in chunks.
 */
export const upsertStreamUsers = async (users) => {
  const payload = users.map((u) => ({
    id: u._id.toString(),
    name: u.fullName,
    image: u.profilePic || "",
  }));

  for (let i = 0; i < payload.length; i += 100) {
    await streamClient.upsertUsers(payload.slice(i, i + 100));
  }
};

export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw error;
  }
};

export const MAX_GROUP_MEMBERS = 100;

/** Server-side group channel helpers. All take plain string user ids. */
export const createGroupChannel = async ({ id, name, createdById, memberIds, image }) => {
  const channel = streamClient.channel("messaging", id, {
    name,
    image: image || "",
    created_by_id: createdById,
    members: memberIds,
    isGroup: true,
  });
  await channel.create();
  return channel;
};

export const getChannel = (id) => streamClient.channel("messaging", id);

export const addChannelMembers = async (id, memberIds, message) =>
  getChannel(id).addMembers(memberIds, message);

export const removeChannelMembers = async (id, memberIds, message) =>
  getChannel(id).removeMembers(memberIds, message);

export const updateChannelData = async (id, data) =>
  getChannel(id).updatePartial({ set: data });

/** The shared one to one channel id for two users, same rule as the client. */
export const dmChannelId = (a, b) => [a.toString(), b.toString()].sort().join("-");

/**
 * Freezing stops every member sending messages or reactions, which is how a
 * blocked conversation is closed for both sides. No-ops when the two have
 * never actually chatted, because then there is no channel yet.
 */
export const setChannelFrozen = async (channelId, frozen) => {
  try {
    await getChannel(channelId).updatePartial({ set: { frozen } });
    return true;
  } catch (error) {
    if (error?.code === 16 || /not exist/i.test(error?.message || "")) return false;
    console.error("Could not change frozen state for", channelId, error.message);
    return false;
  }
};

export const queryChannelState = async (id) => {
  const channel = getChannel(id);
  const state = await channel.query({ members: { limit: MAX_GROUP_MEMBERS } });
  return state;
};
