const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"]
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"]
  },
  avatar: {
    type: String,
    default: ""
  },
  // Para permisos
  role: {
    type: String,
    enum: ['Admin', 'Helper', 'User', 'Alumno', 'Professor'],
    default: 'User'
  },
  // Para Nodemailer
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  bio: { type: String, default: "" },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
