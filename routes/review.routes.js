const router = require("express").Router();
const Review = require("../models/Review.model");
const Skill = require("../models/Skill.model");
const Booking = require("../models/Booking.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// Alumno escribe una reseña (solo si ha tenido esa clase aceptada)
router.post("/", isAuthenticated, async (req, res) => {
  if (req.payload.role !== "Alumno") {
    return res.status(403).json({ message: "Solo los alumnos pueden escribir reseñas" });
  }
  try {
    const { skillId, rating, comment } = req.body;

    const booking = await Booking.findOne({
      student: req.payload._id,
      skill: skillId,
      status: "accepted"
    });
    if (!booking) {
      return res.status(403).json({ message: "Solo puedes reseñar clases que hayas tenido" });
    }

    const review = await Review.create({ author: req.payload._id, skill: skillId, rating, comment });
    await review.populate("author", "name avatar");
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Reseñas de una clase concreta
router.get("/skill/:skillId", async (req, res) => {
  try {
    const reviews = await Review.find({ skill: req.params.skillId })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Todas las reseñas de un profesor (de todas sus clases)
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const skills = await Skill.find({ teacher: req.params.teacherId });
    const skillIds = skills.map(s => s._id);
    const reviews = await Review.find({ skill: { $in: skillIds } })
      .populate("author", "name avatar")
      .populate("skill", "title")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Admin/Helper o el propio autor borran una reseña
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Reseña no encontrada" });

    const esAutor = String(review.author) === String(req.payload._id);
    const esAdmin = req.payload.role === "Admin" || req.payload.role === "Helper";

    if (!esAutor && !esAdmin) {
      return res.status(403).json({ message: "No tienes permiso" });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Reseña eliminada" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
