const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashed });

    res.json(user);
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    

    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user._id, role: user.role }, "secret");

    res.json({ token, userId: user._id, role: user.role });
});

module.exports = router;