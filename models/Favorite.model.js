const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    // El usuario que guarda el favorito
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // La clase guardada
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true
    }
  },
  { timestamps: true }
);

// Esta línea es clave: evita que un mismo usuario guarde la misma clase dos veces
favoriteSchema.index({ user: 1, skill: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);