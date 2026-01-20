import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

export const Posts = sequelize.define("post", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(30),
  },
  description: {
    type: DataTypes.STRING(255),
  },
});
