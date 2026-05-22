const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skill.controller");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const { validateSkill } = require("../middlewares/validator.middleware");

router.get("/", skillController.getAllSkills);
router.get("/:id", skillController.getSkillById);

router.post("/", isAuthenticated, validateSkill, skillController.createSkill);
router.put("/:id", isAuthenticated, validateSkill, skillController.updateSkill);
router.delete("/:id", isAuthenticated, skillController.deleteSkill);

module.exports = router;