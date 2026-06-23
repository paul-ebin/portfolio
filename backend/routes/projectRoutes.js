import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, upload.single('image'), createProject);

router.route('/:id')
  .put(protect, upload.single('image'), updateProject)
  .delete(protect, deleteProject);

export default router;
