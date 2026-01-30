# API Cocina Nipona

API REST para la aplicación de Cocina Nipona desarrollada con Node.js, Express y TypeScript.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Variables de Entorno

Copia el archivo `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

### Desarrollo

```bash
npm run dev
```

### Compilar

```bash
npm run build
```

### Producción

```bash
npm start
```

## 📁 Estructura del Proyecto

```
api/
├── src/
│   ├── index.ts          # Punto de entrada
│   ├── routes/           # Rutas de la API
│   ├── controllers/      # Controladores
│   ├── models/           # Modelos de datos
│   ├── middlewares/      # Middlewares personalizados
│   └── config/           # Configuraciones
├── dist/                 # Código compilado
├── .env                  # Variables de entorno (no versionado)
├── .env.example          # Ejemplo de variables de entorno
├── tsconfig.json         # Configuración TypeScript
└── package.json
```

## 🛠️ Tecnologías

- Node.js
- Express
- TypeScript
- CORS
- dotenv

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot reload
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor en producción
