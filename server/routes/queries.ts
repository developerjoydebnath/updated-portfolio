import express from 'express';
import { Query } from '../models/Query';
import { sendContactEmail, sendReplyEmail } from '../utils/mailer';
import { pusher } from '../utils/pusher';

const router = express.Router();

/**
 * @swagger
 * /api/queries:
 *   get:
 *     summary: Get all contact queries
 *     tags: [Queries]
 *     responses:
 *       200:
 *         description: List of queries
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/queries:
 *   post:
 *     summary: Submit a new contact query
 *     tags: [Queries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Query submitted
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const query = new Query(req.body);
    await query.save();

    // Trigger Pusher notification
    try {
      await pusher.trigger('portfolio-queries', 'new-query', query);
    } catch (pusherError) {
      console.error('Pusher trigger failed:', pusherError);
    }

    // Send email notification
    const { name, email, subject, message } = req.body;
    await sendContactEmail(name, email, subject, message);

    res.status(201).json(query);
  } catch (error) {
    console.error('Error in POST /api/queries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/queries/{id}:
 *   put:
 *     summary: Update a query (e.g. mark as read)
 *     tags: [Queries]
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
 *         description: Query updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!query) return res.status(404).json({ error: 'Not found' });
    res.json(query);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/queries/{id}:
 *   delete:
 *     summary: Delete a query
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Query deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/queries/{id}/reply:
 *   post:
 *     summary: Send a reply email to a query
 *     tags: [Queries]
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
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply sent and query updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/reply', async (req, res) => {
  try {
    const { message } = req.body;
    const query = await Query.findById(req.params.id);
    
    if (!query) return res.status(404).json({ error: 'Query not found' });

    // Send reply email
    await sendReplyEmail(query.email, query.subject, message);

    // Update status to replied
    query.status = 'replied';
    await query.save();

    res.json(query);
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
