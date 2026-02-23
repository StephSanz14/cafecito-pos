# INSTALACIONES EN BACKEND

Inicializamos package.json

```bash
npm init -y
```
## Dependencias necesarias

```bash
npm i express cors dotenv mongoose
```

¿Qué hace cada una?:

express: servidor
cors: permitir llamadas desde el frontend
dotenv: variables de entorno
mongoose: MongoDB

## Dependencias de desarrollo (para trabajar cómodo)

```bash
npm i -D nodemon
```

## Configura "type": "module" y scripts
En backend/package.json agrega:
{
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}

## Crea tu .env en backend
📍 cafesito-pos/backend/.env
PORT=3000
MONGO_URI=mongodb://localhost:27017/cafesito_pos
FRONT_APP_URL=http://localhost:4200

## Ejecutar backend

```bash
npm run dev
```



