import express from 'express';
import Week from '../models/Week.js';
import User from '../models/User.js';
import Submission from '../models/Submission.js';
import ActivityLog from '../models/ActivityLog.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { isValidPassword } from '../utils/validators.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// ========== WEEK MANAGEMENT ==========

// Create week
router.post('/weeks', async (req, res) => {
  try {
    const { week_number, title, description, startDate, deadlineDate, resources } = req.body;

    if (!week_number) {
      return res.status(400).json({ message: 'Week number is required' });
    }

    // Check if week number already exists
    const existingWeek = await Week.findOne({ week_number });
    if (existingWeek) {
      return res.status(400).json({ message: 'Week number already exists' });
    }

    const week = new Week({
      week_number,
      title: title || '',
      description: description || '',
      startDate: startDate ? new Date(startDate) : null,
      deadlineDate: deadlineDate ? new Date(deadlineDate) : null,
      resources: resources || [],
      isActive: false
    });

    await week.save();
    res.status(201).json(week);
  } catch (error) {
    console.error('Create week error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update week
router.put('/weeks/:id', async (req, res) => {
  try {
    const week = await Week.findById(req.params.id);
    if (!week) {
      return res.status(404).json({ message: 'Week not found' });
    }

    const { title, description, startDate, deadlineDate, resources, isActive } = req.body;

    if (title !== undefined) week.title = title;
    if (description !== undefined) week.description = description;
    if (startDate !== undefined) week.startDate = startDate ? new Date(startDate) : null;
    if (deadlineDate !== undefined) week.deadlineDate = deadlineDate ? new Date(deadlineDate) : null;
    if (resources !== undefined) week.resources = resources;
    if (isActive !== undefined) week.isActive = isActive;

    await week.save();
    res.json(week);
  } catch (error) {
    console.error('Update week error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete week
router.delete('/weeks/:id', async (req, res) => {
  try {
    const week = await Week.findById(req.params.id);
    if (!week) {
      return res.status(404).json({ message: 'Week not found' });
    }

    // Check if there are submissions for this week
    const submissions = await Submission.find({ week_id: week._id });
    if (submissions.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete week with existing submissions' 
      });
    }

    await Week.findByIdAndDelete(req.params.id);
    res.json({ message: 'Week deleted successfully' });
  } catch (error) {
    console.error('Delete week error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== USER/GROUP MANAGEMENT ==========

// Create group/user
router.post('/users', async (req, res) => {
  try {
    const { username, password, email, displayName, members, contactEmail, profileImageUrl } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters and contain both letters and numbers' 
      });
    }

    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({
      username,
      password_hash: password, // Will be hashed by pre-save hook
      email: email || '',
      role: 'member',
      displayName: displayName || username,
      members: members || [],
      contactEmail: contactEmail || email || '',
      profileImageUrl: profileImageUrl || ''
    });

    await user.save();
    res.status(201).json({
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      message: 'Group created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'member' })
      .select('-password_hash')
      .sort({ created_at: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin or self)
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Allow admin or the user themselves to update
    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user._id.toString() === req.params.id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const { displayName, email, members, contactEmail, profileImageUrl } = req.body;

    if (displayName !== undefined) user.displayName = displayName;
    if (email !== undefined) user.email = email;
    if (members !== undefined) user.members = members;
    if (contactEmail !== undefined) user.contactEmail = contactEmail;
    if (profileImageUrl !== undefined) user.profileImageUrl = profileImageUrl;

    await user.save();
    res.json({
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      members: user.members,
      email: user.email,
      contactEmail: user.contactEmail,
      profileImageUrl: user.profileImageUrl
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset user password
router.post('/users/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!newPassword || !isValidPassword(newPassword)) {
      return res.status(400).json({ 
        message: 'Valid password is required (8+ chars, letters + numbers)' 
      });
    }

    user.password_hash = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally check for submissions
    const submissions = await Submission.find({ user_id: user._id });
    if (submissions.length > 0) {
      // You might want to handle this differently - maybe soft delete
      return res.status(400).json({ 
        message: 'Cannot delete user with existing submissions' 
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== SUBMISSION MANAGEMENT ==========

// Get all submissions
router.get('/submissions', async (req, res) => {
  try {
    const { weekId, status } = req.query;
    const query = {};
    if (weekId) query.week_id = weekId;
    if (status) query.status = status;

    const submissions = await Submission.find(query)
      .populate('user_id', 'username displayName')
      .populate('week_id', 'week_number title')
      .sort({ created_at: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject submission
router.put('/submissions/:id/status', async (req, res) => {
  try {
    const { status, reviewerNotes } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    submission.status = status;
    if (reviewerNotes !== undefined) {
      submission.reviewerNotes = reviewerNotes;
    }

    await submission.save();
    res.json(submission);
  } catch (error) {
    console.error('Update submission status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export submissions as CSV
router.get('/submissions/export', async (req, res) => {
  try {
    const { weekId } = req.query;
    const query = weekId ? { week_id: weekId } : {};

    const submissions = await Submission.find(query)
      .populate('user_id', 'username displayName')
      .populate('week_id', 'week_number title')
      .sort({ created_at: -1 });

    // Convert to CSV
    const csvHeader = 'Week,Group Name,GitHub Repo,Live Demo,Status,Description,Submitted At\n';
    const csvRows = submissions.map(sub => {
      const week = sub.week_id?.week_number || 'N/A';
      const groupName = sub.user_id?.displayName || sub.user_id?.username || 'N/A';
      const repo = sub.github_repo_url || '';
      const demo = sub.github_live_demo_url || '';
      const status = sub.status || '';
      const desc = (sub.description || '').replace(/,/g, ';'); // Replace commas
      const date = new Date(sub.created_at).toISOString();
      return `${week},"${groupName}","${repo}","${demo}",${status},"${desc}",${date}`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
    res.send(csvHeader + csvRows);
  } catch (error) {
    console.error('Export submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== ANALYTICS ==========

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'member' });
    const totalWeeks = await Week.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const approvedSubmissions = await Submission.countDocuments({ status: 'approved' });
    const pendingSubmissions = await Submission.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      totalWeeks,
      totalSubmissions,
      approvedSubmissions,
      pendingSubmissions
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

