import dotenv from 'dotenv'; // Importa dotenv para manejar variables de entorno
dotenv.config(); // Carga las variables de entorno desde el archivo .env
import { initializeData } from "./src/config/initializeData.js";

import express from 'express'; // Importa el framework Express para crear el servidor web
import dbConnection from './src/config/database.js'; // Importa la configuración de la base de datos
import cors from 'cors'; // Importa CORS para manejar solicitudes entre diferentes orígenes

const app = express(); // Crea una instancia de la aplicación Express
dbConnection(); // Establece la conexión a la base de datos
initializeData(); // Inicializa los datos predeterminados en la base de datos

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: process.env.FRONT_APP_URL, // Permite solicitudes solo desde la URL del frontend definida en las variables de entorno
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.use(express.json()); // Middleware para parsear solicitudes con cuerpo en formato JSON

app.get('/', (req, res) => {
  res.send('WELCOME!');
}); // Ruta raíz para verificar que el servidor está funcionando

app.use('/api', routes); // Hay que importar las rutas

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    method: req.method,
    url: req.originalUrl
  });
}); // Middleware para manejar rutas no encontradas

if (process.env.INITIAL_DATA === "development") {
  console.log("INITIAL_DATA enabled, but no seed implemented yet");
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); // Inicia el servidor en el puerto definido en las variables de entorno 