const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/mailer.config");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  try {
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      verificationToken,
      isVerified: false
    });

    await sendVerificationEmail(user.email, user.name, verificationToken);
    res.status(201).json({ message: "Usuario creado. Revisa tu correo para autorizar." });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "El correo ya está registrado" });
    } else {
      console.error("Error en el registro:", err);
      res.status(500).json({ message: "Error en el registro", err });
    }
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Email o contraseña incorrectos" });
      }

      if (!user.isVerified) {
        return res.status(403).json({ message: "Por favor, autoriza tu cuenta primero en el email." });
      }

      const payload = { _id: user._id, email: user.email, role: user.role, name: user.name };
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      res.status(200).json({ authToken });
    })
    .catch((err) => res.status(500).json({ message: "Error en el login", err }));
};

exports.verifyUser = (req, res) => {
  const { confirmationCode } = req.params;

  User.findOneAndUpdate(
    { verificationToken: confirmationCode },
    { isVerified: true, verificationToken: null },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "El enlace es inválido o ya ha sido usado." });
      }
      res.status(200).json({ message: "¡Cuenta autorizada con éxito! Ya puedes entrar." });
    })
    .catch((err) => res.status(500).json({ message: "Error al verificar la cuenta", err }));
};
