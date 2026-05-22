const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título de la clase es obligatorio"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"]
  },
  category: {
    type: String,
    required: [true, "La categoría es obligatoria"],
    enum: ["Idiomas", "Tecnología", "Deportes", "Cocina", "Arte", "Otros"]
  },
  price: {
    type: Number,
    required: [true, "El precio por hora es obligatorio"]
  },
  image: {
    type: String,
    default: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Skill", skillSchema);
