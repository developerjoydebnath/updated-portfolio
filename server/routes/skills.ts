import express from 'express';
import { Skill } from '../models/Skill';

const router = express.Router();

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Retrieve a list of skills
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: A list of skills.
 */
router.get('/', async (req, res) => {
  try {
    const count = await Skill.countDocuments();
    if (count === 0) {
      const defaultSkills = [
        { name: 'React', percentage: 95, category: 'Frontend' },
        { name: 'TypeScript', percentage: 90, category: 'Frontend' },
        { name: 'Node.js', percentage: 85, category: 'Backend' },
        { name: 'PostgreSQL', percentage: 78, category: 'Database' }
      ];
      await Skill.insertMany(defaultSkills);
    }
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skills]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, level]
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: number
 *               category:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skill created
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   put:
 *     summary: Update a skill
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Skill updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ error: 'Not found' });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete a skill
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
