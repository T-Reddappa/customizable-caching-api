import mongoose from "mongoose";

const cacheSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

export const Cache = mongoose.model("Cache", cacheSchema);
