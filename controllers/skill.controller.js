const Skill = require("../models/Skill.model");

exports.getAllSkills = async (req, res) => {
  const query = {};

  if (req.query.category) query.category = req.query.category;

  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  if (req.query.search) query.title = { $regex: req.query.search, $options: "i" };

  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  let sortObj = { createdAt: -1 };
  if (req.query.sortBy) {
    sortObj = { [req.query.sortBy]: req.query.order === "desc" ? -1 : 1 };
  }

  try {
    const skills = await Skill.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("teacher", "name avatar");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Fallo al obtener las clases", err });
  }
};

exports.createSkill = async (req, res) => {
  const { title, description, price, category, image } = req.body;
  try {
    const skill = await Skill.create({
      title,
      description,
      price,
      category,
      image,
      teacher: req.payload._id
    });
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: "No se pudo crear la clase", err });
  }
};

exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate("teacher", "name avatar");
    if (!skill) return res.status(404).json({ message: "Clase no encontrada" });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar la clase", err });
  }
};

exports.updateSkill = (req, res) => {
  Skill.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(skill => res.json(skill))
    .catch(err => res.status(500).json({ message: "Error al actualizar", err }));
};

exports.deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: "Clase no encontrada" });

    const esDueno = String(skill.teacher) === String(req.payload._id);
    const esAdmin = req.payload.role === "Admin" || req.payload.role === "Helper";

    if (!esDueno && !esAdmin) {
      return res.status(403).json({ message: "No tienes permiso para borrar esta clase" });
    }

    await Skill.findByIdAndDelete(id);
    res.json({ message: "Clase eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al borrar", err });
  }
};
