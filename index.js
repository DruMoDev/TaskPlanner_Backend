import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

const app = express();
app.use(express.json()); //Esto hace que pueda procesar la información de tipo JSON

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "production.env" });
} else {
  dotenv.config({ path: "development.env" });
}

conectarDB();

// Configurar CORS
let whitelist = [
  "https://task-planner-dru.vercel.app",
  "https://task-planner-backend.vercel.app",
  "http://localhost:5173",
  "http://localhost:5173/",
];

// let whitelist = [process.env.FRONTEND_URL, process.env.BACKEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Origin:", origin); // Agrega esta línea para depuración

    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      //No tiene permiso
      callback(new Error("Error de CORS. No estas en la whitelist"));
    }
  },
};

app.use(cors(corsOptions));

// Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
