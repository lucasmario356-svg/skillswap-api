const router = require("express").Router();
const Favorite = require("../models/Favorite.model");
const Skill = require("../models/Skill.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// Dar like a una clase
router.post("/:skillId", isAuthenticated, async (req, res) => {
  try {
    const fav = await Favorite.create({ user: req.payload._id, skill: req.params.skillId });
    res.status(201).json(fav);
  } catch (err) {
    // Error 11000 = ya existe (el índice único lo evita)
    if (err.code === 11000) return res.status(200).json({ message: "Ya le habías dado like" });
    res.status(500).json(err);
  }
});

// Quitar like
router.delete("/:skillId", isAuthenticated, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.payload._id, skill: req.params.skillId });
    res.json({ message: "Like eliminado" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Total de likes de todas las clases de un profesor
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const skills = await Skill.find({ teacher: req.params.teacherId });
    const skillIds = skills.map(s => s._id);
    const count = await Favorite.countDocuments({ skill: { $in: skillIds } });
    res.json({ totalLikes: count });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Comprobar si el usuario logueado ya le dio like a una clase
router.get("/check/:skillId", isAuthenticated, async (req, res) => {
  try {
    const fav = await Favorite.findOne({ user: req.payload._id, skill: req.params.skillId });
    res.json({ liked: !!fav });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
