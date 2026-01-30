import { Dialect } from "sequelize";

export default {
  development: {
    dialect: "sqlite" as Dialect,
    storage: "./database.sqlite",
    logging: false
  }
};