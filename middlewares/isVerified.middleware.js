const isVerified = (req, res, next) => {
  if (req.payload && req.payload.isVerified) {
    next(); 
  } else {
    res.status(403).json({ 
      message: "Debes verificar tu email antes de realizar esta acción." 
    });
  }
};

module.exports = isVerified;