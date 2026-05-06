const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { submitLeaveRequest, getMyLeaveRequests, getProfile } = require('../controllers/employeeController');
const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.post('/leave-requests', submitLeaveRequest);
router.get('/leave-requests', getMyLeaveRequests);

module.exports = router;