const express = require('express');
const { protect, employer } = require('../middleware/authMiddleware');
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

const router = express.Router();

// All routes are protected and require employer role
router.use(protect);
router.use(employer);

router.route('/')
  .get(getDepartments)
  .post(createDepartment);

router.route('/:id')
  .put(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;