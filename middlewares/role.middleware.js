// Este middleware comprueba si el usuario logueado tiene el rol necesario
const isAdmin = (req, res, next) => {
  if (req.payload && req.payload.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Acceso denegado: se requieren permisos de administrador" });
  }
};

module.exports = { isAdmin };