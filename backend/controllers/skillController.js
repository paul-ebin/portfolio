import Skill from '../models/Skill.js';

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({}).sort({ order: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { name, category, order } = req.body;
    let icon = '';

    if (req.file) {
      icon = req.file.path;
    } else if (req.body.icon) {
      icon = req.body.icon;
    }

    const skill = new Skill({
      name,
      category,
      icon,
      order: order || 0
    });

    const createdSkill = await skill.save();
    res.status(201).json(createdSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { name, category, order } = req.body;
    const skill = await Skill.findById(req.params.id);

    if (skill) {
      skill.name = name || skill.name;
      skill.category = category || skill.category;
      skill.order = order !== undefined ? order : skill.order;

      if (req.file) {
        skill.icon = req.file.path;
      } else if (req.body.icon) {
        skill.icon = req.body.icon;
      }

      const updatedSkill = await skill.save();
      res.json(updatedSkill);
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (skill) {
      await skill.deleteOne();
      res.json({ message: 'Skill removed' });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
