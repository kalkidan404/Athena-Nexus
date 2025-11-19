import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get activity logs (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { limit = 100, action } = req.query;
    const query = action ? { action } : {};

    const logs = await ActivityLog.find(query)
      .populate('user_id', 'username')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(logs);
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

