const Booking = require("../models/Booking.model");
const Skill = require("../models/Skill.model");
const { transporter } = require("../utils/mailer.config");

exports.createBooking = (req, res) => {
  const { skillId, date, message } = req.body;
  const studentId = req.payload._id;

  Skill.findById(skillId)
    .populate("teacher")
    .then((skill) => {
      if (!skill) return res.status(404).json({ message: "Skill not found" });

      return Booking.create({
        skill: skillId,
        student: studentId,
        teacher: skill.teacher ? skill.teacher._id : null,
        date,
        message
      })
      .then((booking) => {
        if (skill.teacher && skill.teacher.email && transporter && typeof transporter.sendMail === 'function') {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: skill.teacher.email,
            subject: "Tienes una nueva reserva en SkillSwap",
            text: `Hola, tienes una solicitud para tu clase ${skill.title}.`
          };
          transporter.sendMail(mailOptions).catch(err => console.log(err.message));
        }
        res.status(201).json(booking);
      });
    })
    .catch((err) => res.status(500).json(err));
};

exports.getMyBookings = (req, res) => {
  Booking.find({ student: req.payload._id })
    .populate("skill")
    .populate("teacher")
    .then(bookings => res.json(bookings))
    .catch(err => res.status(500).json(err));
};

exports.getReceivedBookings = (req, res) => {
  Booking.find({ teacher: req.payload._id })
    .populate("skill")
    .populate("student")
    .then(bookings => res.json(bookings))
    .catch(err => res.status(500).json(err));
};

exports.updateBookingStatus = (req, res) => {
  const { status } = req.body;
  Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .then(updatedBooking => res.json(updatedBooking))
    .catch(err => res.status(500).json(err));
};
exports.deleteBooking = (req, res) => {
  Booking.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: "Reserva eliminada" }))
    .catch(err => res.status(500).json(err));
};