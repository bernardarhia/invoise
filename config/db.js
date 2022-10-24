import { Sequelize } from "sequelize";
const { env } = process;
export default new Sequelize('invoise', 'root', env.DB_PASSWORD, {
  dialect: "mysql",
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  logging:false
});
