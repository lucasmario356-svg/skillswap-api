const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  imageUrl: { 
    type: String, 
    default: "https://via.placeholder.com/150" 
  }
});

module.exports = mongoose.model("Category", categorySchema);