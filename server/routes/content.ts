import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { Content } from '../models/Content';

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

// Get content (create default if not exists)
/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Get website content (hero, stats)
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: Website content
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = new Content({
        hero: { name: '', role: '', bio: '', profileImage: '', resumeUrl: '' },
        aboutMe: '',
        proficientIn: [],
        socialLinks: { github: '', linkedin: '', twitter: '', facebook: '' },
        stats: [
          { _id: '1', label: 'Years Experience', value: '0', icon: 'Briefcase' },
          { _id: '2', label: 'Projects Completed', value: '0', icon: 'CheckCircle' },
          { _id: '3', label: 'Clients Served', value: '0', icon: 'Users' },
          { _id: '4', label: 'Awards Won', value: '0', icon: 'Award' }
        ]
      });
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update content
/**
 * @swagger
 * /api/content:
 *   put:
 *     summary: Update website content
 *     tags: [Content]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               hero:
 *                 type: string
 *               aboutMe:
 *                 type: string
 *               proficientIn:
 *                 type: string
 *               socialLinks:
 *                 type: string
 *               stats:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       500:
 *         description: Internal server error
 */
router.put('/', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), async (req, res) => {
  try {
    let { hero, aboutMe, proficientIn, socialLinks, stats } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Parse JSON strings if they are strings (from FormData)
    const parseJSON = (val: any) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch (e) {
          return val;
        }
      }
      return val;
    };

    hero = parseJSON(hero);
    stats = parseJSON(stats);
    proficientIn = parseJSON(proficientIn);
    socialLinks = parseJSON(socialLinks);

    const existingContent = await Content.findOne();

    // Handle profileImage
    if (files?.profileImage?.[0]) {
      const imageUrl = `/uploads/${files.profileImage[0].filename}`;
      if (existingContent?.hero?.profileImage?.includes('/uploads/')) {
        const oldFilename = existingContent.hero.profileImage.split('/uploads/')[1];
        const oldFilePath = path.join(__dirname, '../../uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      if (hero) hero.profileImage = imageUrl;
    }

    // Handle resume
    if (files?.resume?.[0]) {
      const resumeUrl = `/uploads/${files.resume[0].filename}`;
      if (existingContent?.hero?.resumeUrl?.includes('/uploads/')) {
        const oldFilename = existingContent.hero.resumeUrl.split('/uploads/')[1];
        const oldFilePath = path.join(__dirname, '../../uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      if (hero) hero.resumeUrl = resumeUrl;
    }

    const updateData = {
      hero,
      aboutMe,
      proficientIn,
      socialLinks,
      stats
    };

    const content = await Content.findOneAndUpdate({}, updateData, { new: true, upsert: true });
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
