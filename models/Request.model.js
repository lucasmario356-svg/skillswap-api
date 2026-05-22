const { Schema, model } = require("mongoose");

const requestSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedRole: { type: String, enum: ['Alumno', 'Professor'], required: true },
    justification: { type: String, required: true }, // "Por qué quieres ser alumno"
    experience: { type: String },
    subjects: { type: String },
    portfolio: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
  },
  { timestamps: true }
);

module.exports = model("Request", requestSchema);