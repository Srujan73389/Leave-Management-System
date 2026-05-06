const mongoose = require('mongoose');

const LeaveTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeaveType', LeaveTypeSchema);