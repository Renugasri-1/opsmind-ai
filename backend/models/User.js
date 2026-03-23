const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  // ✅ NEW: Role for admin system
  role: {
    type: String,
    default: "user" // "admin" for you
  }

}, { timestamps: true }); // optional but useful

module.exports = mongoose.model("User", userSchema);