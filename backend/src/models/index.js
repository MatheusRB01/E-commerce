import sequelize from "../config/database.js"
import { DataTypes } from "sequelize"

import UserModel from "./User.js"
import MessageModel from "./Message.js"

const db = {
  sequelize,
  User: UserModel(sequelize, DataTypes),
  Message: MessageModel(sequelize, DataTypes)
}

export default db