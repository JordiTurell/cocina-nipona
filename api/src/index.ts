import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from "./config/database";

//#region Rutas
import authRoutes from './routes/auth.routes';
import rolesRoutes from './routes/roles.routes';
//#endregion

// Configuración
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-file-name']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/roles', rolesRoutes)
// Iniciar servidor
sequelize.sync({ alter: true }).then(() => {
    console.log('🗄️  Base de datos sincronizada (tablas recreadas)');
    app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
});

export default app;
