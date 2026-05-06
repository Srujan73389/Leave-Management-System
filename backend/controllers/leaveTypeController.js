const LeaveType = require('../models/LeaveType');

// Get all leave types
const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find().sort({ createdAt: -1 });
    res.json(leaveTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a leave type
const createLeaveType = async (req, res) => {
  const { name, description } = req.body;
  try {
    const existing = await LeaveType.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Leave type name already exists' });
    }
    const leaveType = await LeaveType.create({ name, description });
    res.status(201).json(leaveType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a leave type
const updateLeaveType = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const leaveType = await LeaveType.findById(id);
    if (!leaveType) {
      return res.status(404).json({ message: 'Leave type not found' });
    }
    if (name && name !== leaveType.name) {
      const existing = await LeaveType.findOne({ name });
      if (existing) {
        return res.status(400).json({ message: 'Leave type name already exists' });
      }
    }
    leaveType.name = name || leaveType.name;
    leaveType.description = description || leaveType.description;
    await leaveType.save();
    res.json(leaveType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a leave type
const deleteLeaveType = async (req, res) => {
  const { id } = req.params;
  try {
    const leaveType = await LeaveType.findById(id);
    if (!leaveType) {
      return res.status(404).json({ message: 'Leave type not found' });
    }
    await leaveType.deleteOne();
    res.json({ message: 'Leave type removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLeaveTypes, createLeaveType, updateLeaveType, deleteLeaveType };