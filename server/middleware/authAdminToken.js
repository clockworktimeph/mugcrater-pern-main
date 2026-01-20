import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authAdminToken = (req, res, next) => {
  let authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  if (authHeader.startsWith("Bearer ")) {
    authHeader = authHeader.slice(7).trim();
  }

  jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    if (user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    req.user = user;
    next();
  });
};
