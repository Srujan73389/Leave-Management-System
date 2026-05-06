const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Core fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'employer'], default: 'employee' },
  position: { type: String },
  createdAt: { type: Date, default: Date.now },

  // Employee-specific fields
  employeeId: { type: String, unique: true, sparse: true },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other', ''] }, // 👈 added empty string
  birthdate: { type: Date },
  department: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  phone: { type: String },
  mustChangePassword: { type: Boolean, default: false },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
});

module.exports = mongoose.model('User', UserSchema);