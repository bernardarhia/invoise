import { Model, DataTypes } from "sequelize";
import db from "../config/db.js";
import { anyid } from "anyid";
import formatDate from "../utils/extractDate.js";
class Token extends Model {}

Token.init(
  {
    authToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordConfirmationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    veryEmailToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db, // We need to pass the connection instance
    modelName: "token", // We need to choose the model name
  }
);

Token.beforeCreate((token, options) => {
  const id = anyid()
    .encode("Aa0")
    .bits(48 * 8)
    .random()
    .id();

  token.dataValues.veryEmailToken = id;
  token.dataValues.createdAt = formatDate(token.dataValues.createdAt);
  token.dataValues.updatedAt = formatDate(token.dataValues.updatedAt);
});
export default Token;
