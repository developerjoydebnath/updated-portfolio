// import express from 'express';
// // import fs from 'fs'; // No longer needed for file deletion
// import { Project } from '../models/Project';
// import { deleteImage, upload } from '../utils/cloudinary';

// const router = express.Router();

// // Local Multer config removed

// // const upload = multer({ storage }); // Replaced by import

// /**
//  * @swagger
//  * /api/projects:
//  *   get:
//  *     summary: Get all projects
//  *     tags: [Projects]
//  *     responses:
//  *       200:
//  *         description: List of projects
//  *       500:
//  *         description: Internal server error
//  */
// router.get('/', async (req, res) => {
//   try {
//     const count = await Project.countDocuments();
//     if (count === 0) {
//       const defaultProjects = [
//         {
//           title: 'E-Commerce Platform',
//           description: 'A full-featured online shopping platform with cart and checkout.',
//           image: 'https://picsum.photos/600/400',
//           techStack: ['React', 'TypeScript', 'Tailwind CSS'],
//           category: 'Full Stack'
//         }
//       ];
//       await Project.insertMany(defaultProjects);
//     }
//     const projects = await Project.find().sort({ createdAt: -1 });
//     res.json(projects);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// /**
//  * @swagger
//  * /api/projects:
//  *   post:
//  *     summary: Create a new project
//  *     tags: [Projects]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required: [title, description]
//  *             properties:
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *               techStack:
//  *                 type: string
//  *                 description: JSON string or comma-separated
//  *               category:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Project created
//  *       500:
//  *         description: Internal server error
//  */
// router.post('/', upload.fields([
//   { name: 'image', maxCount: 1 },
//   { name: 'screenshots', maxCount: 10 }
// ]), async (req, res) => {
//   try {
//     const { title, description, techStack, category, liveUrl, githubUrl } = req.body;
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//     let parsedTechStack = techStack;
//     if (typeof techStack === 'string') {
//       try {
//         parsedTechStack = JSON.parse(techStack);
//       } catch (e) {
//         parsedTechStack = techStack.split(',').map((s: string) => s.trim());
//       }
//     }

//     const image = files?.image?.[0] ? files.image[0].path : '';
//     const screenshots = files?.screenshots?.map(f => f.path) || [];

//     const project = new Project({
//       title,
//       description,
//       techStack: parsedTechStack,
//       category,
//       image,
//       liveUrl,
//       githubUrl,
//       screenshots
//     });

//     await project.save();
//     res.status(201).json(project);
//   } catch (error) {
//     console.error('Error creating project:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Update project
// router.put('/:id', upload.fields([
//   { name: 'image', maxCount: 1 },
//   { name: 'screenshots', maxCount: 10 }
// ]), async (req, res) => {
//   try {
//     const { title, description, techStack, category, liveUrl, githubUrl, existingScreenshots } = req.body;
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//     let parsedTechStack = techStack;
//     if (typeof techStack === 'string') {
//       try {
//         parsedTechStack = JSON.parse(techStack);
//       } catch (e) {
//         parsedTechStack = techStack.split(',').map((s: string) => s.trim());
//       }
//     }

//     let parsedExistingScreenshots = existingScreenshots;
//     if (typeof existingScreenshots === 'string') {
//       try {
//         parsedExistingScreenshots = JSON.parse(existingScreenshots);
//       } catch (e) {
//         parsedExistingScreenshots = [];
//       }
//     }

//     const updateData: any = {
//       title,
//       description,
//       techStack: parsedTechStack,
//       category,
//       liveUrl,
//       githubUrl
//     };

//     const existingProject = await Project.findById(req.params.id);
//     if (!existingProject) return res.status(404).json({ error: 'Not found' });

//     // Handle main image
//     if (files?.image?.[0]) {
//       updateData.image = files.image[0].path;
//       if (existingProject.image) {
//         await deleteImage(existingProject.image);
//       }
//     }

//     // Handle screenshots
//     const newScreenshots = files?.screenshots?.map(f => f.path) || [];
//     updateData.screenshots = [...(parsedExistingScreenshots || []), ...newScreenshots];

//     // Delete removed screenshots
//     const removedScreenshots = existingProject.screenshots.filter(s => !updateData.screenshots.includes(s));
//     for (const screenshot of removedScreenshots) {
//       await deleteImage(screenshot);
//     }
    
//     const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     res.json(project);
//   } catch (error) {
//     console.error('Error updating project:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// /**
//  * @swagger
//  * /api/projects/{id}:
//  *   delete:
//  *     summary: Delete a project
//  *     tags: [Projects]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Project deleted
//  *       404:
//  *         description: Not found
//  *       500:
//  *         description: Internal server error
//  */
// router.delete('/:id', async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) return res.status(404).json({ error: 'Not found' });

//     // Delete image from Cloudinary
//     if (project.image) {
//       await deleteImage(project.image);
//     }

//     // Delete screenshots from Cloudinary
//     if (project.screenshots && project.screenshots.length > 0) {
//       for (const screenshot of project.screenshots) {
//         await deleteImage(screenshot);
//       }
//     }

//     await Project.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Deleted' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// export default router;


import express from 'express';
import { Project } from '../models/Project';
import { deleteImage, upload } from '../utils/cloudinary';

const router = express.Router();

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
 *               liveUrl:
 *                 type: string
 *               githubUrl:
 *                 type: string
 *               screenshots:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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

    const image = files?.image?.[0] ? files.image[0].path : '';
    const screenshots = files?.screenshots?.map(f => f.path) || [];

    const project = new Project({
      title,
      description,
      techStack: parsedTechStack || [],
      category,
      image,
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      screenshots
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               techStack:
 *                 type: string
 *               category:
 *                 type: string
 *               liveUrl:
 *                 type: string
 *               githubUrl:
 *                 type: string
 *               existingScreenshots:
 *                 type: string
 *                 description: JSON string array of existing screenshot URLs
 *               image:
 *                 type: string
 *                 format: binary
 *               screenshots:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Project updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
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

    let parsedExistingScreenshots: string[] = [];
    if (typeof existingScreenshots === 'string') {
      try {
        parsedExistingScreenshots = JSON.parse(existingScreenshots);
      } catch (e) {
        parsedExistingScreenshots = [];
      }
    } else if (Array.isArray(existingScreenshots)) {
      parsedExistingScreenshots = existingScreenshots;
    }

    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updateData: any = {
      title: title || existingProject.title,
      description: description || existingProject.description,
      techStack: parsedTechStack || existingProject.techStack,
      category: category || existingProject.category,
      liveUrl: liveUrl || existingProject.liveUrl || '',
      githubUrl: githubUrl || existingProject.githubUrl || ''
    };

    // Handle main image
    if (files?.image?.[0]) {
      updateData.image = files.image[0].path;
      if (existingProject.image && existingProject.image !== updateData.image) {
        await deleteImage(existingProject.image);
      }
    } else if (existingProject.image) {
      updateData.image = existingProject.image;
    }

    // Handle screenshots
    const newScreenshots = files?.screenshots?.map(f => f.path) || [];
    const allScreenshots = [...parsedExistingScreenshots, ...newScreenshots];
    
    // Remove duplicates
    updateData.screenshots = [...new Set(allScreenshots)];

    // Delete removed screenshots from Cloudinary
    const removedScreenshots = existingProject.screenshots.filter(
      s => !updateData.screenshots.includes(s)
    );
    
    for (const screenshot of removedScreenshots) {
      await deleteImage(screenshot);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    
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
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete main image from Cloudinary
    if (project.image) {
      await deleteImage(project.image);
    }

    // Delete screenshots from Cloudinary
    if (project.screenshots && project.screenshots.length > 0) {
      for (const screenshot of project.screenshots) {
        await deleteImage(screenshot);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;