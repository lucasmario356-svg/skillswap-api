const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  skill: {
    type: Schema.Types.ObjectId,
    ref: "Skill",
    required: true
  },
  date: {
    type: Date,
    required: [true, "La fecha de la reserva es obligatoria"]
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "cancelled"],
    default: "pending"
  },
  message: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = model("Booking", bookingSchema);
