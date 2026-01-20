import dotenv from "dotenv";

dotenv.config();

export const authAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    return next();
  }
  return res.status(403).json({ error: "Access denied. Admins only." });
};
