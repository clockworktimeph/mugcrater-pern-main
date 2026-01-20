import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../db/db.js";

dotenv.config();

// Sign Up
export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, "Editor"]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login Admin
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role = 'Admin'",
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = userQuery.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Validate Token
export const validateToken = (req, res) => {
  res.json({ user: req.user });
};
export const logoutUser = async (req, res) => {
  res.json({ message: "User logged out successfully" });
};

// Users
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role FROM users ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const createUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;

    if (!username || !email || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = await pool.query(
      "INSERT INTO users (username, email, role) VALUES ($1, $2, $3) RETURNING *",
      [username, email, role]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  if (!username || !email || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updatedUser = await pool.query(
      "UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING *",
      [username, email, role, id]
    );

    if (updatedUser.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedUser.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Portfolio
export const getPortfolios = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM portfolio ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching portfolios:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const getPortfolioById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM portfolio WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching portfolio:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const createPortfolio = async (req, res) => {
  const { title, description, category, url } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !description || !category) {
    return res
      .status(400)
      .json({ error: "Title, description, and category are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO portfolio (title, description, category, url, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, category, url, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating portfolio:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const updatePortfolio = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, url } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const existingPortfolio = await pool.query(
      "SELECT * FROM portfolio WHERE id = $1",
      [id]
    );
    if (existingPortfolio.rows.length === 0) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    const updateQuery =
      "UPDATE portfolio SET title = $1, description = $2, category = $3, url = $4, image = COALESCE($5, image) WHERE id = $6 RETURNING *;";
    const values = [title, description, category, url, image, id];

    const result = await pool.query(updateQuery, values);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating portfolio:", err.message);
    res.status(500).json({ error: "Failed to update portfolio" });
  }
};
export const deletePortfolio = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM portfolio WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    res.json({ message: "Portfolio deleted successfully" });
  } catch (err) {
    console.error("Error deleting portfolio:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Blog
export const getBlogs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blog ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching blog:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await pool.query("SELECT * FROM blog WHERE id = $1", [id]);
    if (blog.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog.rows[0]);
  } catch (err) {
    console.error("Error fetching blog:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const createBlog = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const loggedInEmail = decoded.email;

  try {
    const { title, content, category, status } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    const image = req.file.filename;
    const blogStatus = status || "Unpublished";

    const newBlog = await pool.query(
      `INSERT INTO blog (title, content, created_by, category, image, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, content, loggedInEmail, category, image, blogStatus]
    );

    res.status(201).json({
      message: "Blog created successfully!",
      blog: newBlog.rows[0],
    });
  } catch (err) {
    console.error("Error creating blog:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, status } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const image = req.file ? req.file.filename : null;

    const updateQuery =
      "UPDATE blog SET title = $1, content = $2, category = $3, image = COALESCE($4, image), status = $5 WHERE id = $6 RETURNING *;";
    const updatedBlog = await pool.query(updateQuery, [
      title,
      content,
      category,
      image,
      status,
      id,
    ]);

    if (updatedBlog.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog updated successfully!",
      blog: updatedBlog.rows[0],
    });
  } catch (err) {
    console.error("Error updating blog:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlog = await pool.query(
      "DELETE FROM blog WHERE id = $1 RETURNING *",
      [id]
    );
    if (deletedBlog.rowCount === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
