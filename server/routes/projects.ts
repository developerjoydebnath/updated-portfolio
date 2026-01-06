import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { Project } from '../models/Project';

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      const defaultProjects = [
        {
          title: 'E-Commerce Platform',
          description: 'A full-featured online shopping platform with cart and checkout.',
          image: 'https://picsum.photos/600/400',
          techStack: ['React', 'TypeScript', 'Tailwind CSS'],
          category: 'Full Stack'
        }
      ];
      await Project.insertMany(defaultProjects);
    }
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               techStack:
 *                 type: string
 *                 description: JSON string or comma-separated
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 *       500:
 *         description: Internal server error
 */
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, description, techStack, category, liveUrl, githubUrl } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let parsedTechStack = techStack;
    if (typeof techStack === 'string') {
      try {
        parsedTechStack = JSON.parse(techStack);
      } catch (e) {
        parsedTechStack = techStack.split(',').map((s: string) => s.trim());
      }
    }

    const image = files?.image?.[0] ? `/uploads/${files.image[0].filename}` : '';
    const screenshots = files?.screenshots?.map(f => `/uploads/${f.filename}`) || [];

    const project = new Project({
      title,
      description,
      techStack: parsedTechStack,
      category,
      image,
      liveUrl,
      githubUrl,
      screenshots
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
router.put('/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, description, techStack, category, liveUrl, githubUrl, existingScreenshots } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let parsedTechStack = techStack;
    if (typeof techStack === 'string') {
      try {
        parsedTechStack = JSON.parse(techStack);
      } catch (e) {
        parsedTechStack = techStack.split(',').map((s: string) => s.trim());
      }
    }

    let parsedExistingScreenshots = existingScreenshots;
    if (typeof existingScreenshots === 'string') {
      try {
        parsedExistingScreenshots = JSON.parse(existingScreenshots);
      } catch (e) {
        parsedExistingScreenshots = [];
      }
    }

    const updateData: any = {
      title,
      description,
      techStack: parsedTechStack,
      category,
      liveUrl,
      githubUrl
    };

    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) return res.status(404).json({ error: 'Not found' });

    // Handle main image
    if (files?.image?.[0]) {
      updateData.image = `/uploads/${files.image[0].filename}`;
      if (existingProject.image?.includes('/uploads/')) {
        const oldFilename = existingProject.image.split('/uploads/')[1];
        const oldFilePath = path.join(__dirname, '../../uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
    }

    // Handle screenshots
    const newScreenshots = files?.screenshots?.map(f => `/uploads/${f.filename}`) || [];
    updateData.screenshots = [...(parsedExistingScreenshots || []), ...newScreenshots];

    // Delete removed screenshots from disk
    const removedScreenshots = existingProject.screenshots.filter(s => !updateData.screenshots.includes(s));
    removedScreenshots.forEach(s => {
      if (s.includes('/uploads/')) {
        const filename = s.split('/uploads/')[1];
        const filePath = path.join(__dirname, '../../uploads', filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });

    // Delete image file if exists
    if (project.image && project.image.includes('/uploads/')) {
      const filename = project.image.split('/uploads/')[1];
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
