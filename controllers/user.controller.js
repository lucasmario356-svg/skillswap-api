const User = require("../models/User.model");

exports.getCurrentUser = (req, res) => {
  User.findById(req.payload._id)
    .then(user => {
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(user);
    })
    .catch(err => res.status(500).json(err));
};

exports.updateUser = (req, res) => {
  const { name, avatar, bio } = req.body;
  User.findByIdAndUpdate(req.payload._id, { name, avatar, bio }, { new: true })
    .then(updatedUser => res.json(updatedUser))
    .catch(err => res.status(500).json(err));
};

// Cualquier usuario (sin contraseña)
exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .select("-password -verificationToken")
    .then(user => {
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(user);
    })
    .catch(err => res.status(500).json(err));
};

// Lista pública de todos los profesores activos
exports.getProfesores = (req, res) => {
  User.find({ role: "Professor", isBlocked: false })
    .select("-password -verificationToken")
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
};

// solo Admin/Helper
exports.getAllUsers = (req, res) => {
  if (req.payload.role !== "Admin" && req.payload.role !== "Helper") {
    return res.status(403).json({ message: "No tienes permiso" });
  }
  User.find()
    .select("-password -verificationToken")
    .then(users => res.json(users))
    .catch(err => res.status(500).json(err));
};

// Bloquear/desbloquear usuario
exports.blockUser = (req, res) => {
  if (req.payload.role !== "Admin" && req.payload.role !== "Helper") {
    return res.status(403).json({ message: "No tienes permiso" });
  }
  User.findByIdAndUpdate(req.params.id, { isBlocked: req.body.isBlocked }, { new: true })
    .select("-password -verificationToken")
    .then(user => res.json(user))
    .catch(err => res.status(500).json(err));
};
