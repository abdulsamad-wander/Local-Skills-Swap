import mongoose from "mongoose";

/**
 * Groups live in Stream, which has no file storage for us, so an uploaded
 * group icon is kept here and served by GET /api/chat/groups/:id/image.
 */
const groupImageSchema = new mongoose.Schema(
  {
    channelId: { type: String, required: true, unique: true, index: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
  { timestamps: true }
);

const GroupImage = mongoose.model("GroupImage", groupImageSchema);

export default GroupImage;
