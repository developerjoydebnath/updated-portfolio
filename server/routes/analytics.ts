import express from 'express';
import { Analytics } from '../models/Analytics';

const router = express.Router();

// Record a visit
/**
 * @swagger
 * /api/analytics/visit:
 *   post:
 *     summary: Record a new visit
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *               ip:
 *                 type: string
 *               userAgent:
 *                 type: string
 *     responses:
 *       201:
 *         description: Visit recorded successfully
 *       500:
 *         description: Internal server error
 */
router.post('/visit', async (req, res) => {
  try {
    const { path, ip, userAgent } = req.body;
    const visit = new Analytics({ path, ip, userAgent });
    await visit.save();
    res.status(201).json({ message: 'Visit recorded' });
  } catch (error) {
    console.error('Error recording visit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics stats
/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get analytics statistics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Analytics data including total visits, unique visitors, visits by path, and visits over time
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const totalVisits = await Analytics.countDocuments();
    const uniqueVisitors = (await Analytics.distinct('ip')).length;
    
    // Get visits by path
    const visitsByPath = await Analytics.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get visits over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const visitsOverTime = await Analytics.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalVisits,
      uniqueVisitors,
      visitsByPath,
      visitsOverTime
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
