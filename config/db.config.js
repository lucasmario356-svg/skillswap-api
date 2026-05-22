const mongoose = require("mongoose");

// Me conecto a MongoDB Atlas usando la URI de mi archivo .env
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB correctamente");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error.message);
  });