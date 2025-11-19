import express from 'express';
import Week from '../models/Week.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';

const router = express.Router();

// Get all weeks (public)
router.get('/', async (req, res) => {
  try {
    const weeks = await Week.find().sort({ week_number: -1 });
    res.json(weeks);
  } catch (error) {
    console.error('Get weeks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active week
router.get('/active', async (req, res) => {
  try {
    const week = await Week.findOne({ isActive: true });
    if (!week) {
      return res.status(404).json({ message: 'No active week found' });
    }
    res.json(week);
  } catch (error) {
    console.error('Get active week error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get week by ID
router.get('/:id', async (req, res) => {
  try {
    const week = await Week.findById(req.params.id);
    if (!week) {
      return res.status(404).json({ message: 'Week not found' });
    }
    res.json(week);
  } catch (error) {
    console.error('Get week error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get submissions for a week (public - only approved)
router.get('/:id/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find({
      week_id: req.params.id,
      status: 'approved'
    })
      .populate('user_id', 'username displayName members')
      .sort({ created_at: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Get week submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public stats (no authentication required)
router.get('/stats/public', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'member' });
    const totalWeeks = await Week.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    res.json({
      totalUsers,
      totalWeeks,
      totalSubmissions
    });
  } catch (error) {
    console.error('Get public stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

