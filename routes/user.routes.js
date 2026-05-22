const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const userController = require("../controllers/user.controller");

router.get("/me", isAuthenticated, userController.getCurrentUser);
router.put("/me", isAuthenticated, userController.updateUser);

router.get("/profesores", userController.getProfesores);
router.get("/all", isAuthenticated, userController.getAllUsers);

router.get("/:id", userController.getUserById);
router.patch("/:id/block", isAuthenticated, userController.blockUser);

module.exports = router;
