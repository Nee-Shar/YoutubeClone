import mongoose, { Schema } from "mongoose";

const subsSchema = new Schema(
  {
    subscriber: {
      // One who is subsribing
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      // One to whom  is being subscribed
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subs = mongoose.model("Subs", subsSchema);
