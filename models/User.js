import { Model, DataTypes, ENUM } from "sequelize";
import db from "../config/db.js";
import formatDate from "../utils/extractDate.js";
import { hashPassword } from "../utils/password.js";
import Clients from "./Client.js";
import Token from "./Token.js";
class Users extends Model {}

Users.init(
  {
    firstName: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: ENUM("client", "admin", "developer"),
      allowNull: false,
      defaultValue: "client",
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  },
  {
    sequelize: db, // We need to pass the connection instance
    modelName: "Users", // We need to choose the model name
  }
);

Users.hasOne(Token, {
  onDelete: "cascade",
});
Token.belongsTo(Users, {
  foreignKey: {
    allowNull: false,
  },
});
Users.hasMany(Clients)
Clients.belongsTo(Users,{
  foreignKey: {
    allowNull: false,
  },
})

Users.beforeCreate(async (user, options) => {
  const { email, password, createdAt, updatedAt, role } = user.dataValues;
  const hashedPassword = await hashPassword(password);

  user.dataValues.password = hashedPassword;
  user.dataValues.createdAt = formatDate(createdAt);
  user.dataValues.updatedAt = formatDate(updatedAt);

  if (["admin", "developer"].includes(role)) user.dataValues.verified = false;
  const foundUser = await Users.findOne({ where: { email } });

  if (foundUser) throw new Error("User already exists");
});

export default Users;
