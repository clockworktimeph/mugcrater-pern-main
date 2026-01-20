import app from "./app.js";
import dotenv from "dotenv";
import { sequelize } from "./db/db.js";


// Main
const main = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Log: Connection to database is good");
    app.listen(3000);
  } catch (error) {
    console.log("ERROR");
    console.error("Error:", error);
  }
};
main();

dotenv.config();

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Log: Server running on Port: ${port}`);
});
