import express from "express";
import mongoose, { modelNames } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://localhost:27017/auth_system_db");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

const WatchHistory = mongoose.model(
  "WatchHistory",
  new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    animeId: String,
    episodeId: String,
    watchedOn: { type: Date, default: Date.now },
  })
);
const WatchList = mongoose.model(
  "WatchList",
  new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    animeId: String,
    addedOn: { type: Date, default: Date.now },
  })
);

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const payload = jwt.verify(token, "jwt_secret");
      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).send("Unauthorized");
    }
  } else {
    return res.status(401).send("Unauthorized");
  }
};

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    return res.status(201).send("User registered");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, "jwt_secret");
      return res.send({ token });
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error logging in");
  }
});

app.post("/watchdata", authMiddleware, async (req, res) => {
  try {
    const { animeId, episodeId } = req.body;
    const userId = req.user.userId;
    if (!animeId || !episodeId) {
      return res.status(400).send("Missing animeId or episodeId");
    }
    const existingEntry = await WatchHistory.findOne({
      userId,
      animeId,
    });
    if (existingEntry) {
      existingEntry.episodeId = episodeId;
      await existingEntry.save();
      return res.status(200).send("Watch data updated");
    }
    const watchHistory = new WatchHistory({ userId, animeId, episodeId });
    await watchHistory.save();
    return res.status(201).send("Watch data recorded");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error recording watch data");
  }
});
app.post("/watchlist", authMiddleware, async (req, res) => {
  try {
    const { animeId } = req.body;
    const userId = req.user.userId;
    if (!animeId) {
      return res.status(400).send("Missing animeId  ");
    }
    const existingEntry = await WatchList.findOne({
      userId,
      animeId,
    });
    if (existingEntry) {
      await existingEntry.save();
      return res.status(200).send("Watch List updated");
    }
    const watchList = new WatchList({ userId: userId, animeId: animeId });
    await watchList.save();
    return res.status(201).send("Watch list recorded");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error recording watch list");
  }
});

app.get("/watchhistory", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send("No token provided");
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "jwt_secret");
    const userId = decoded.userId;
    const watchHistory = await WatchHistory.find({ userId: userId });
    if (!watchHistory) return res.status(404).send("WatchHistory not found");
    return res.json(watchHistory);
  } catch (error) {
    console.error(error);
    return res.status(401).send("Invalid or expired token");
  }
});
app.get("/watchlist", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send("No token provided");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwt_secret");
    const userId = decoded.userId;
    const watchList = await WatchList.find({ userId: userId });
    if (!watchList) return res.status(404).send("watchList not found");
    return res.json(watchList);
  } catch (error) {
    console.error(error);
    return res.status(401).send("Invalid or expired token");
  }
});
app.delete("/watchhistory", authMiddleware, async (req, res) => {
  try {
    const { animeId } = req.body;
    const userId = req.user.userId;
    const result = await WatchHistory.deleteOne({
      userId: userId,
      animeId: animeId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Watch history not found." });
    }
    res.send({ message: "Watch history deleted successfully." });
  } catch {
    console.error("Error deleting watch history:", error);
    res.status(500).send({ message: "Failed to delete watch history." });
  }
});
app.delete("/watchlist", authMiddleware, async (req, res) => {
  try {
    const { animeId } = req.body;
    const userId = req.user.userId;
    const result = await WatchList.deleteOne({
      userId: userId,
      animeId: animeId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Watch list not found." });
    }
    res.send({ message: "Watch list deleted successfully." });
  } catch {
    console.error("Error deleting watch list:", error);
    res.status(500).send({ message: "Failed to delete watch list." });
  }
});

app.get("/user", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send("No token provided");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwt_secret");
    const userId = decoded.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(401).send("Invalid or expired token");
  }
});

app.get("/protected", authMiddleware, (req, res) => {
  const userId = req.user.userId;
  res.send(`User ID is: ${userId}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  return res.send("Server is up and running!");
});
