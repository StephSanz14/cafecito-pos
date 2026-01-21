import fs from 'fs';  // Módulo del sistema de archivos
import path from 'path'; // Módulo para manejar rutas de archivos
import { fileURLToPath } from 'url'; // Módulo para convertir URL de archivos a rutas de sistema de archivos

const __filename = fileURLToPath(import.meta.url); // Obtiene la ruta del archivo actual
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

const errorHandler = (err, req, res, next) => {
  const dateTime = new Date(); // Fecha y hora actual
  
  // Formatear el mensaje de error para el archivo de log
  const logFilePath = path.join(__dirname, '../../logs/error.log'); // Ruta al archivo de log
  const logMessage = `${dateTime.toISOString()} | ${req.method} ${req.url} | ${err.message} | ${err.stack}\n`; // Mensaje de log con detalles del error

  // Crear directorio si no existe
  const logDir = path.dirname(logFilePath); // Directorio del archivo de log
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true }); // Crear directorio de logs si no existe
  }

  fs.appendFile(logFilePath, logMessage, (fsErr) => {
    if (fsErr) {
      console.error('Failed to write into log file:', fsErr); // Manejo de error al escribir en el archivo de log
    }
  });

  // No enviar respuesta si ya se envió
  if (!res.headersSent) {
    res.status(500).json({
      status: 'error', // Estado de error
      message: 'Internal Server Error' // Mensaje genérico para el cliente
    });
  }

};

export default errorHandler; // Exporta el middleware de manejo de errores