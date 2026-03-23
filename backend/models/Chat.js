const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: String,
  query: String,
  answer: String,
  chunks: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", chatSchema);