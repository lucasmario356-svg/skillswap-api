const router = require("express").Router();
const Request = require("../models/Request.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const { sendRoleApprovedEmail } = require("../utils/mailer.config");

// Usuario envía solicitud de rol
router.post("/submit", isAuthenticated, async (req, res) => {
  try {
    const newRequest = await Request.create({ ...req.body, user: req.payload._id });
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Admin/Helper ven todas las solicitudes
router.get("/all", isAuthenticated, async (req, res) => {
  if (req.payload.role !== "Admin" && req.payload.role !== "Helper") {
    return res.status(403).json({ message: "No tienes permiso" });
  }
  try {
    const requests = await Request.find().populate("user");
    res.json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Admin/Helper aprueban o rechazan — y envían email al aprobar
router.patch("/handle/:id", isAuthenticated, async (req, res) => {
  if (req.payload.role !== "Admin" && req.payload.role !== "Helper") {
    return res.status(403).json({ message: "No tienes permiso" });
  }
  const { status } = req.body;
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user");

    if (status === "Approved") {
      await User.findByIdAndUpdate(request.user._id, { role: request.requestedRole });
      await sendRoleApprovedEmail(request.user.email, request.user.name, request.requestedRole);
    }

    res.json({ message: `Solicitud ${status}` });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
