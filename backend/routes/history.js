const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const auth = require("../middleware/auth");

// ✅ GET chat history
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// ✅ DELETE chat 
router.delete("/:id", auth, async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: "Chat deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;