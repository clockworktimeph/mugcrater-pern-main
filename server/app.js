import express from 'express';
import path from 'path';
import { fileURLToPath } from "url";
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const uploadsPathPortfolio = path.join(__dirname, "/uploads/portfolio");
const uploadsPathBlog = path.join(__dirname, "/uploads/blog");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Log: API running on Port: ${port}`);
});

// Login
app.use('/api/auth/login', routes);
app.use('/api/auth/signup', routes);
app.use('/api/auth/validate', routes);
app.use('/api/dashboard', routes);

// User
app.get('/api/getusers', routes);
app.get('/api/getuser/:id', routes);
app.post('/api/createuser', routes);
app.put('/api/updateuser/:id', routes);
app.delete('/api/deleteuser/:id', routes);

// Portfolio
app.get('/api/getportfolios', routes);
app.get('/api/getportfolio/:id', routes);
app.post('/api/createportfolio', routes);
app.put('/api/updateportfolio/:id', routes);
app.delete('/api/deleteportfolio/:id', routes);

// Blog
app.get('/api/getblogs', routes);
app.get('/api/getblog/:id', routes);
app.post('/api/createblog', routes);
app.put('/api/updateblog/:id', routes);
app.delete('/api/deleteblog/:id', routes);

// Serve static files for portfolio and blog uploads
app.use("/uploads/portfolio", express.static(uploadsPathPortfolio));
app.use("/uploads/blog", express.static(uploadsPathBlog));

export default app;
