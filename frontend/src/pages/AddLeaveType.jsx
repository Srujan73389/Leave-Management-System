import React, { useState } from 'react';
import { createLeaveType } from '../services/leaveTypeService';

const AddLeaveType = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
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
      await createLeaveType(formData);
      setSuccessMessage('SUCCESS: Leave type added successfully');
      setFormData({ name: '', description: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding leave type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-leave-type-container">
      <h2>ADD LEAVE TYPE</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Leave Type</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Casual Leave"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description of leave type"
            rows="4"
            required
          />
        </div>
        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? 'Saving...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default AddLeaveType;