const Joi = require("joi");

const validateSkill = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().valid("Idiomas", "Tecnología", "Deportes", "Cocina", "Arte", "Otros").required(),
    price: Joi.number().positive().required(),
    image: Joi.string().uri().allow("")
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

module.exports = { validateSkill };