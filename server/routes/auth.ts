import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await (user as any).comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d',
    });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Seed admin user
router.post('/seed', async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const admin = new User({
        email: 'admin@example.com',
        password: 'password', // Will be hashed by pre-save hook
      });
      await admin.save();
      return res.json({ message: 'Admin user seeded successfully' });
    }
    res.status(400).json({ error: 'Admin user already exists' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
