import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink, order } = req.body;
    let image = '';

    if (req.file) {
      image = req.file.path;
    } else if (req.body.image) {
      image = req.body.image; // fallback
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }

    const project = new Project({
      title,
      description,
      image,
      techStack: techStack ? (Array.isArray(techStack) ? techStack : techStack.split(',')) : [],
      githubLink,
      liveLink,
      order: order || 0
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink, order } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.description = description || project.description;
      if (techStack) {
        project.techStack = Array.isArray(techStack) ? techStack : techStack.split(',');
      }
      project.githubLink = githubLink || project.githubLink;
      project.liveLink = liveLink || project.liveLink;
      project.order = order !== undefined ? order : project.order;

      if (req.file) {
        project.image = req.file.path;
      }

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
