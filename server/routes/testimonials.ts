import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { Testimonial } from '../models/Testimonial';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all testimonials
/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: List of testimonials
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new testimonial
/**
 * @swagger
 * /api/testimonials:
 *   post:
 *     summary: Add a new testimonial
 *     tags: [Testimonials]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, role, content, rating]
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               company:
 *                 type: string
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Testimonial created
 *       500:
 *         description: Internal server error
 */
router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    const { name, role, company, content, rating } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : '';

    const testimonial = new Testimonial({
      name,
      role,
      company,
      content,
      rating: Number(rating),
      avatar
    });

    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update testimonial
/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: Update a testimonial
 *     tags: [Testimonials]
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
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               company:
 *                 type: string
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Testimonial updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', upload.single('avatar'), async (req, res) => {
  try {
    const { name, role, company, content, rating } = req.body;
    const updateData: any = {
      name,
      role,
      company,
      content,
      rating: Number(rating)
    };

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;

      // Delete old avatar if exists
      const existingTestimonial = await Testimonial.findById(req.params.id);
      if (existingTestimonial?.avatar) {
        const oldUrl = existingTestimonial.avatar;
        if (oldUrl.includes('/uploads/')) {
          const oldFilename = oldUrl.split('/uploads/')[1];
          const oldFilePath = path.join(__dirname, '../uploads', oldFilename);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete testimonial
/**
 * @swagger
 * /api/testimonials/{id}:
 *   delete:
 *     summary: Delete a testimonial
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Testimonial deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
