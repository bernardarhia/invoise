import { Model, DataTypes } from "sequelize";
import db from "../config/db.js";
import formatDate from "../utils/extractDate.js";
class Clients extends Model {}

Clients.init(
  {
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db, // We need to pass the connection instance
    modelName: "clients", // We need to choose the model name
  }
);

Clients.beforeCreate((client, options) => {
  client.dataValues.createdAt = formatDate(client.dataValues.createdAt);
  client.dataValues.updatedAt = formatDate(client.dataValues.updatedAt);
});
export default Clients;
