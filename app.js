require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();


// Configuración de la base de datos
require("./config/db.config");

// Middlewares
app.use(cors());
app.use(express.json());

// --- IMPORTACIÓN DE RUTAS ---
const authRoutes = require("./routes/auth.routes");
const skillRoutes = require("./routes/skill.routes");
const bookingRoutes = require("./routes/booking.routes");
const userRoutes = require("./routes/user.routes");
const uploadRoutes = require("./routes/upload.routes"); 
const requestRoutes = require("./routes/request.routes");
const reviewRoutes = require("./routes/review.routes");
const favoriteRoutes = require("./routes/favorite.routes");

// uso de rutas 
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API de SkillSwap funcionando perfectamente");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});