const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType
} = require('../controllers/leaveTypeController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET is allowed for both employees and employers
router.get('/', getLeaveTypes);

// POST, PUT, DELETE are restricted to employers only
router.post('/', (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Not authorized as employer' });
  }
  next();
}, createLeaveType);

router.put('/:id', (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Not authorized as employer' });
  }
  next();
}, updateLeaveType);

router.delete('/:id', (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Not authorized as employer' });
  }
  next();
}, deleteLeaveType);

module.exports = router;