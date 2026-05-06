import React, { useState } from 'react';
import { createDepartment } from '../services/departmentService';

const AddDepartment = () => {
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    try {
      await createDepartment(formData);
      setSuccessMessage('SUCCESS: Department added successfully');
      setFormData({ name: '', shortName: '', code: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-department-container">
      <h2>ADD DEPARTMENT</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Department Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Department Short Name</label>
          <input
            type="text"
            name="shortName"
            value={formData.shortName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Department Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? 'Adding...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;