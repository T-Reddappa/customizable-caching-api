import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./db";
import { Cache } from "./cacheSchema";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const MAX_CACHE_SIZE = 10;
const PORT = process.env.PORT || 3000;

app.post("/cache", async (req: Request, res: Response) => {
  const { key, value } = req.body;
  if (!key || !value) {
    res.status(400).json({ error: "Key and values are required" });
    return;
  }

  const cacheSize = await Cache.countDocuments();

  if (cacheSize >= MAX_CACHE_SIZE) {
    res.status(400).json({ error: "Cache is full" });
    return;
  }

  try {
    await Cache.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );
    res.status(201).json({ message: "Cache stored successfully", key, value });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/cache/:key", async (req: Request, res: Response) => {
  const { key } = req.params;
  const cache = await Cache.findOne({ key });

  if (!cache) {
    res.status(404).json({ error: "Cache with key not found" });
    return;
  }

  res.json({ key, value: cache.value });
});

app.delete("/cache/:key", async (req: Request, res: Response) => {
  const { key } = req.params;
  const deleted = await Cache.findOneAndDelete({ key });

  if (!deleted) {
    res.status(404).json({ error: "Key not found" });
    return;
  }

  res.json({ message: "Deleted successfully", key });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
