import Sequelize from "sequelize";
import "dotenv/config";
import pkg from "pg";
import dotenv from "dotenv";


export const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
  }
);


dotenv.config();
const { Pool } = pkg;

// Local:
// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_DATABASE,
// });

// Live: NEON
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(() => console.log("Log: ✅ PostgreSQL Connected!"))
  .catch(err => console.error("Log: ❌ Database Connection Error:", err));

export default pool;
