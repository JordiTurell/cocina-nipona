import { Sequelize } from "sequelize-typescript";
import config from "./config";

//Modelos
import { Usuario } from '../models/usuario';
import { Rol } from "../models/rols";

const sequelize = new Sequelize({
    dialect: config.development.dialect,
    storage: config.development.storage,
    models: [
        Usuario,
        Rol
    ]
});

export default sequelize;