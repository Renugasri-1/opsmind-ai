const express = require("express");
const router = express.Router();

const Chat = require("../models/Chat");
const User = require("../models/User");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

// ✅ GET ALL USERS
router.get("/users", auth, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ✅ GET ALL CHATS
router.get("/chats", auth, adminOnly, async (req, res) => {
  const chats = await Chat.find().sort({ createdAt: -1 });
  res.json(chats);
});

router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const chats = await Chat.find();

    const docCount = {};
    const topicCount = {};

    chats.forEach(chat => {
      //  document usage
      (chat.chunks || []).forEach(c => {
        const doc = c.source.split("\\").pop();
        docCount[doc] = (docCount[doc] || 0) + 1;
      });

      // count topics (simple keywords)
      const words = chat.query.toLowerCase().split(" ");
      words.forEach(w => {
        if (w.length > 3) {
          topicCount[w] = (topicCount[w] || 0) + 1;
        }
      });
    });

    res.json({ docCount, topicCount });

  } catch (err) {
    res.status(500).json({ error: "Stats failed" });
  }
});

// ✅ DELETE USER
router.delete("/user/:id", auth, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// ✅ DELETE CHAT
router.delete("/chat/:id", auth, adminOnly, async (req, res) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.json({ message: "Chat deleted" });
});

module.exports = router;