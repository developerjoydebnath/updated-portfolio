// import express from 'express';
// // import fs from 'fs';
// import { Content } from '../models/Content';
// import { deleteImage, upload } from '../utils/cloudinary';

// const router = express.Router();

// // Configure Multer
// // const storage = multer.diskStorage({ ... });
// // const upload = multer({ storage });

// // Get content (create default if not exists)
// /**
//  * @swagger
//  * /api/content:
//  *   get:
//  *     summary: Get website content (hero, stats)
//  *     tags: [Content]
//  *     responses:
//  *       200:
//  *         description: Website content
//  *       500:
//  *         description: Internal server error
//  */
// router.get('/', async (req, res) => {
//   try {
//     let content = await Content.findOne();
//     if (!content) {
//       content = new Content({
//         hero: { name: '', role: '', bio: '', profileImage: '', resumeUrl: '' },
//         aboutMe: '',
//         proficientIn: [],
//         socialLinks: { github: '', linkedin: '', twitter: '', facebook: '' },
//         stats: [
//           { _id: '1', label: 'Years Experience', value: '0', icon: 'Briefcase' },
//           { _id: '2', label: 'Projects Completed', value: '0', icon: 'CheckCircle' },
//           { _id: '3', label: 'Clients Served', value: '0', icon: 'Users' },
//           { _id: '4', label: 'Awards Won', value: '0', icon: 'Award' }
//         ]
//       });
//       await content.save();
//     }
//     res.json(content);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Update content
// /**
//  * @swagger
//  * /api/content:
//  *   put:
//  *     summary: Update website content
//  *     tags: [Content]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               hero:
//  *                 type: string
//  *               aboutMe:
//  *                 type: string
//  *               proficientIn:
//  *                 type: string
//  *               socialLinks:
//  *                 type: string
//  *               stats:
//  *                 type: string
//  *               profileImage:
//  *                 type: string
//  *                 format: binary
//  *               resume:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       200:
//  *         description: Content updated successfully
//  *       500:
//  *         description: Internal server error
//  */
// router.put('/', upload.fields([
//   { name: 'profileImage', maxCount: 1 },
//   { name: 'resume', maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     let { hero, aboutMe, proficientIn, socialLinks, stats } = req.body;
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//     // Parse JSON strings if they are strings (from FormData)
//     const parseJSON = (val: any) => {
//       if (typeof val === 'string') {
//         try {
//           return JSON.parse(val);
//         } catch (e) {
//           return val;
//         }
//       }
//       return val;
//     };

//     hero = parseJSON(hero);
//     stats = parseJSON(stats);
//     proficientIn = parseJSON(proficientIn);
//     socialLinks = parseJSON(socialLinks);

//     const existingContent = await Content.findOne();

//     // Handle profileImage
//     if (files?.profileImage?.[0]) {
//       const imageUrl = files.profileImage[0].path;
//       if (existingContent?.hero?.profileImage) {
//         await deleteImage(existingContent.hero.profileImage);
//       }
//       if (hero) hero.profileImage = imageUrl;
//     }

//     // Handle resume
//     if (files?.resume?.[0]) {
//       const resumeUrl = files.resume[0].path;
//       if (existingContent?.hero?.resumeUrl) {
//         await deleteImage(existingContent.hero.resumeUrl);
//       }
//       if (hero) hero.resumeUrl = resumeUrl;
//     }

//     const updateData = {
//       hero,
//       aboutMe,
//       proficientIn,
//       socialLinks,
//       stats
//     };

//     const content = await Content.findOneAndUpdate({}, updateData, { new: true, upsert: true });
//     res.json(content);
//   } catch (error) {
//     console.error('Error updating content:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// export default router;


import express from 'express';
import { Content } from '../models/Content';
import { deleteImage, upload } from '../utils/cloudinary';

const router = express.Router();

// Get content (create default if not exists)
router.get('/', async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = new Content({
        hero: { 
          name: '', 
          role: '', 
          bio: '', 
          profileImage: '', 
          resumeUrl: '' 
        },
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
router.put('/',(req, res, next) => {
  console.log('Content-Type:', req.headers['content-type']);
  next();
}, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), async (req, res) => {
  console.log('request comes')
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

    console.log(hero, stats, proficientIn, socialLinks, files)

    const existingContent = await Content.findOne();
    let updateHero = hero || (existingContent?.hero || {});

    // Handle profileImage
    if (files?.profileImage?.[0]) {
      const imageUrl = files.profileImage[0].path;
      if (existingContent?.hero?.profileImage) {
        await deleteImage(existingContent.hero.profileImage);
      }
      updateHero.profileImage = imageUrl;
    } else if (hero?.profileImage === '' || hero?.profileImage === null) {
      // Handle case when profile image is explicitly removed
      if (existingContent?.hero?.profileImage) {
        await deleteImage(existingContent.hero.profileImage);
      }
      updateHero.profileImage = '';
    }

    // Handle resume
    if (files?.resume?.[0]) {
      const resumeUrl = files.resume[0].path;
      if (existingContent?.hero?.resumeUrl) {
        await deleteImage(existingContent.hero.resumeUrl);
      }
      updateHero.resumeUrl = resumeUrl;
    } else if (hero?.resumeUrl === '' || hero?.resumeUrl === null) {
      // Handle case when resume is explicitly removed
      if (existingContent?.hero?.resumeUrl) {
        await deleteImage(existingContent.hero.resumeUrl);
      }
      updateHero.resumeUrl = '';
    }

    const updateData = {
      hero: updateHero,
      aboutMe: aboutMe || existingContent?.aboutMe || '',
      proficientIn: proficientIn || existingContent?.proficientIn || [],
      socialLinks: socialLinks || existingContent?.socialLinks || {},
      stats: stats || existingContent?.stats || []
    };

    const content = await Content.findOneAndUpdate(
      {}, 
      updateData, 
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true 
      }
    );
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;