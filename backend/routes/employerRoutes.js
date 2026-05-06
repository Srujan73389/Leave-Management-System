const express = require('express');
const { protect, employer } = require('../middleware/authMiddleware');
const {
  getAllLeaveRequests,
  getLeaveRequestById,
  reviewLeaveRequest,
  deleteLeaveRequest,
  getAllEmployees,
  changePassword
} = require('../controllers/employerController');

const router = express.Router();

router.use(protect);
router.use(employer);

router.get('/leave-requests', getAllLeaveRequests);
router.get('/leave-requests/:id', getLeaveRequestById);
router.put('/leave-requests/:id', reviewLeaveRequest);
router.delete('/leave-requests/:id', deleteLeaveRequest);
router.get('/employees', getAllEmployees);
router.put('/change-password', changePassword);

module.exports = router;