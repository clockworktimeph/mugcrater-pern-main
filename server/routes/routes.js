import express from 'express';
import { authAdminToken } from "../middleware/authAdminToken.js";
import { authAdmin } from "../middleware/authAdmin.js";
import uploadPortfolio from "../middleware/uploadPortfolio.js";
import uploadBlog from "../middleware/uploadBlog.js";
import { loginUser, logoutUser, signupUser, validateToken, getUsers, getUserById, createUser, updateUser, deleteUser, 
  getPortfolios, getPortfolioById, createPortfolio, updatePortfolio, deletePortfolio, 
  getBlogs, getBlogById, createBlog, updateBlog, deleteBlog} from '../controllers/controllers.js';


const router = express.Router();

// Login
router.post("/api/auth/login", loginUser);
router.post("/api/auth/signup", signupUser);
router.post("/api/auth/logout", logoutUser);
router.get("/api/auth/validate", validateToken);

// Forgot Password
router.get("/api/auth/forgot-password");

// User
router.get('/api/getusers', authAdminToken, authAdmin, getUsers);
router.get('/api/getuser/:id', authAdminToken, authAdmin, getUserById);
router.post('/api/createuser', authAdminToken, authAdmin, createUser);
router.put('/api/updateuser/:id', authAdminToken, authAdmin, updateUser);
router.delete('/api/deleteuser/:id', authAdminToken, authAdmin, deleteUser);

// Portfolio
router.get('/api/getportfolios', getPortfolios);
router.get('/api/getportfolio/:id', getPortfolioById);
router.post("/api/createportfolio", authAdminToken, authAdmin, uploadPortfolio.single("image"), createPortfolio);
router.put('/api/updateportfolio/:id', authAdminToken, authAdmin, uploadPortfolio.single('image'), updatePortfolio);
router.delete('/api/deleteportfolio/:id', authAdminToken, authAdmin, deletePortfolio);

// Blog
router.get('/api/getblogs', getBlogs);
router.get('/api/getblog/:id', getBlogById);
router.post("/api/createblog", authAdminToken, authAdmin, uploadBlog.single("image"), createBlog);
router.put('/api/updateblog/:id', authAdminToken, authAdmin, uploadBlog.single('image'), updateBlog);
router.delete('/api/deleteblog/:id', authAdminToken, authAdmin, deleteBlog);

export default router;
