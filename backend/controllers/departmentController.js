const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a department
// @route   POST /api/departments
const createDepartment = async (req, res) => {
  const { name, shortName, code } = req.body;
  try {
    // Check if department with same code exists
    const existing = await Department.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Department code already exists' });
    }

    const department = await Department.create({ name, shortName, code });
    res.status(201).json(department);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, shortName, code } = req.body;
  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // If code is being changed, check uniqueness
    if (code && code !== department.code) {
      const existing = await Department.findOne({ code });
      if (existing) {
        return res.status(400).json({ message: 'Department code already exists' });
      }
    }

    department.name = name || department.name;
    department.shortName = shortName || department.shortName;
    department.code = code || department.code;
    await department.save();

    res.json(department);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    await department.deleteOne();
    res.json({ message: 'Department removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };