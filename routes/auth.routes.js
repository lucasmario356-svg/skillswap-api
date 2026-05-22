const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/verify/:confirmationCode", authController.verifyUser);

router.get("/verify", isAuthenticated, (req, res, next) => {
  
  User.findById(req.payload._id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.status(200).json(user);
    })
    .catch((err) => next(err));
});

module.exports = router;