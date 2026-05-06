const express = require('express');
const { protect, employer } = require('../middleware/authMiddleware');
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  viewEmployeePassword
} = require('../controllers/employeeMgmtController');

const router = express.Router();

// All routes require authentication and employer role
router.use(protect);
router.use(employer);

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .put(updateEmployee)
  .delete(deleteEmployee);

router.post('/:id/view-password', viewEmployeePassword);

module.exports = router;