const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");

router.post("/image", fileUploader.single("imageUrl"), (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ message: "No se ha subido ningún archivo" });
    return;
  }
  res.json({ fileUrl: req.file.path });
});

module.exports = router;