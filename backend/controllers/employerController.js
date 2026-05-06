const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all leave requests (optionally filtered by status)
// @route   GET /api/employer/leave-requests
const getAllLeaveRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;
    const requests = await LeaveRequest.find(filter)
      .populate('user', 'name email employeeId gender phone city country address birthdate department firstName lastName')
      .sort({ submittedAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a single leave request by ID
// @route   GET /api/employer/leave-requests/:id
const getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate('user', 'name email employeeId gender phone city country address birthdate department firstName lastName');
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.json(leaveRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve or reject a leave request
// @route   PUT /api/employer/leave-requests/:id
const reviewLeaveRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const leaveRequest = await LeaveRequest.findById(id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    leaveRequest.status = status;
    leaveRequest.reviewedBy = req.user._id;
    leaveRequest.reviewedAt = Date.now();
    await leaveRequest.save();
    res.json(leaveRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a leave request
// @route   DELETE /api/employer/leave-requests/:id
const deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    await leaveRequest.deleteOne();
    res.json({ message: 'Leave request deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all employees
// @route   GET /api/employer/employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Change employer password
// @route   PUT /api/employer/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New passwords do not match' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllLeaveRequests,
  getLeaveRequestById,
  reviewLeaveRequest,
  deleteLeaveRequest,
  getAllEmployees,
  changePassword
};