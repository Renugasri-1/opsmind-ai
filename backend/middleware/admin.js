function adminOnly(req, res, next) {
  console.log("User role:", req.userRole); // ✅ DEBUG

  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  next();
}

module.exports = adminOnly;