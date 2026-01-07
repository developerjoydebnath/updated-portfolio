// import express from 'express';
// // import fs from 'fs';
// import { Testimonial } from '../models/Testimonial';
// import { deleteImage, upload } from '../utils/cloudinary';

// const router = express.Router();

// // Configure multer for image upload
// // const storage = multer.diskStorage({ ... }); // Removed

// // const upload = multer({ storage: storage }); // Replaced

// // Get all testimonials
// /**
//  * @swagger
//  * /api/testimonials:
//  *   get:
//  *     summary: Get all testimonials
//  *     tags: [Testimonials]
//  *     responses:
//  *       200:
//  *         description: List of testimonials
//  *       500:
//  *         description: Internal server error
//  */
// router.get('/', async (req, res) => {
//   try {
//     const testimonials = await Testimonial.find().sort({ createdAt: -1 });
//     res.json(testimonials);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Add new testimonial
// /**
//  * @swagger
//  * /api/testimonials:
//  *   post:
//  *     summary: Add a new testimonial
//  *     tags: [Testimonials]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required: [name, role, content, rating]
//  *             properties:
//  *               name:
//  *                 type: string
//  *               role:
//  *                 type: string
//  *               company:
//  *                 type: string
//  *               content:
//  *                 type: string
//  *               rating:
//  *                 type: number
//  *               avatar:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       201:
//  *         description: Testimonial created
//  *       500:
//  *         description: Internal server error
//  */
// router.post('/', upload.single('avatar'), async (req, res) => {
//   try {
//     const { name, role, company, content, rating } = req.body;
//     const avatar = req.file ? req.file.path : '';

//     const testimonial = new Testimonial({
//       name,
//       role,
//       company,
//       content,
//       rating: Number(rating),
//       avatar
//     });

//     await testimonial.save();
//     res.status(201).json(testimonial);
//   } catch (error) {
//     console.error('Error adding testimonial:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Update testimonial
// /**
//  * @swagger
//  * /api/testimonials/{id}:
//  *   put:
//  *     summary: Update a testimonial
//  *     tags: [Testimonials]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               role:
//  *                 type: string
//  *               company:
//  *                 type: string
//  *               content:
//  *                 type: string
//  *               rating:
//  *                 type: number
//  *               avatar:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       200:
//  *         description: Testimonial updated
//  *       404:
//  *         description: Not found
//  *       500:
//  *         description: Internal server error
//  */
// router.put('/:id', upload.single('avatar'), async (req, res) => {
//   try {
//     const { name, role, company, content, rating } = req.body;
//     const updateData: any = {
//       name,
//       role,
//       company,
//       content,
//       rating: Number(rating)
//     };

//     if (req.file) {
//       updateData.avatar = req.file.path;

//       // Delete old avatar if exists
//       const existingTestimonial = await Testimonial.findById(req.params.id);
//       if (existingTestimonial?.avatar) {
//          await deleteImage(existingTestimonial.avatar);
//       }
//     }

//     const testimonial = await Testimonial.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     if (!testimonial) {
//       return res.status(404).json({ error: 'Testimonial not found' });
//     }

//     res.json(testimonial);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Delete testimonial
// /**
//  * @swagger
//  * /api/testimonials/{id}:
//  *   delete:
//  *     summary: Delete a testimonial
//  *     tags: [Testimonials]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Testimonial deleted
//  *       404:
//  *         description: Not found
//  *       500:
//  *         description: Internal server error
//  */
// router.delete('/:id', async (req, res) => {
//   try {
//     const testimonial = await Testimonial.findById(req.params.id);
//     if (!testimonial) {
//       return res.status(404).json({ error: 'Testimonial not found' });
//     }
    
//     if (testimonial.avatar) {
//       await deleteImage(testimonial.avatar);
//     }

//     await Testimonial.findByIdAndDelete(req.params.id);
    
//     res.json({ message: 'Testimonial deleted' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// export default router;


import express from 'express';
import { Testimonial } from '../models/Testimonial';
import { deleteImage, upload } from '../utils/cloudinary';

const router = express.Router();

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
    
    if (!name || !role || !content || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const avatar = req.file ? req.file.path : '';

    const testimonial = new Testimonial({
      name,
      role,
      company: company || '',
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
    
    const existingTestimonial = await Testimonial.findById(req.params.id);
    if (!existingTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    const updateData: any = {
      name: name || existingTestimonial.name,
      role: role || existingTestimonial.role,
      company: company || existingTestimonial.company || '',
      content: content || existingTestimonial.content,
      rating: rating ? Number(rating) : existingTestimonial.rating
    };

    if (req.file) {
      updateData.avatar = req.file.path;
      
      // Delete old avatar if exists and it's a Cloudinary URL
      if (existingTestimonial.avatar && existingTestimonial.avatar !== updateData.avatar) {
        await deleteImage(existingTestimonial.avatar);
      }
    } else if (existingTestimonial.avatar) {
      updateData.avatar = existingTestimonial.avatar;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
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
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    // Delete avatar from Cloudinary
    if (testimonial.avatar) {
      await deleteImage(testimonial.avatar);
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;