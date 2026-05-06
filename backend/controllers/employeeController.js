const LeaveRequest = require('../models/LeaveRequest');

const submitLeaveRequest = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  try {
    const leaveRequest = await LeaveRequest.create({
      user: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason
    });
    res.status(201).json(leaveRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ user: req.user._id }).sort({ submittedAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { submitLeaveRequest, getMyLeaveRequests, getProfile };