const jwt =require("jsonwebtoken");

function auth(req, res, next) {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, "secret");
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

}

module.exports = auth;