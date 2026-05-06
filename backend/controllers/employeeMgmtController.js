const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all employees
// @route   GET /api/employees
const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new employee
// @route   POST /api/employees
const createEmployee = async (req, res) => {
  const {
    employeeId, firstName, lastName, email, password, gender, birthdate,
    department, address, city, country, phone, confirmPassword
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check for existing employeeId (if provided)
    if (employeeId) {
      const existingId = await User.findOne({ employeeId });
      if (existingId) {
        return res.status(400).json({ message: 'Employee ID already exists' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const name = `${firstName || ''} ${lastName || ''}`.trim();

    const employee = await User.create({
      employeeId,
      firstName,
      lastName,
      name,
      email,
      password: hashedPassword,
      gender: gender || undefined,
      birthdate: birthdate || undefined,
      department: department || undefined,
      address: address || undefined,
      city: city || undefined,
      country: country || undefined,
      phone: phone || undefined,
      role: 'employee',
      mustChangePassword: true
    });

    const employeeData = employee.toObject();
    delete employeeData.password;
    res.status(201).json(employeeData);
  } catch (err) {
    console.error('🔥 Server error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    employeeId, firstName, lastName, email, gender, birthdate,
    department, address, city, country, phone, status
  } = req.body;

  try {
    const employee = await User.findById(id);
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if new email is already used by another user
    if (email && email !== employee.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Check if new employeeId is already used by another user
    if (employeeId && employeeId !== employee.employeeId) {
      const existingId = await User.findOne({ employeeId });
      if (existingId) {
        return res.status(400).json({ message: 'Employee ID already exists' });
      }
    }

    // Update fields
    employee.employeeId = employeeId || employee.employeeId;
    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.name = `${firstName || employee.firstName} ${lastName || employee.lastName}`.trim();
    employee.email = email || employee.email;
    employee.gender = gender || employee.gender;
    employee.birthdate = birthdate || employee.birthdate;
    employee.department = department || employee.department;
    employee.address = address || employee.address;
    employee.city = city || employee.city;
    employee.country = country || employee.country;
    employee.phone = phone || employee.phone;
    employee.status = status || employee.status;

    await employee.save();

    const updatedEmployee = employee.toObject();
    delete updatedEmployee.password;
    res.json(updatedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await User.findById(id);
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await employee.deleteOne();
    res.json({ message: 'Employee removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    View employee password (requires employer's password verification)
// @route   POST /api/employees/:id/view-password
const viewEmployeePassword = async (req, res) => {
  const { id } = req.params;
  const { adminPassword } = req.body;

  try {
    const employer = await User.findById(req.user._id);
    if (!employer || employer.role !== 'employer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const isMatch = await bcrypt.compare(adminPassword, employer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin password' });
    }

    const employee = await User.findById(id);
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // For security, do NOT return the actual hashed password. Return a dummy.
    res.json({ password: '•••••••• (cannot retrieve original)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  viewEmployeePassword
};