import React, { useState, useEffect } from 'react';
import { submitLeaveRequest } from '../services/employeeService';
import { getLeaveTypes } from '../services/leaveTypeService';

const LeaveForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const data = await getLeaveTypes();
        setLeaveTypes(data);
        setError('');
      } catch (err) {
        console.error('Failed to load leave types:', err);
        setError('Could not load leave types. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitLeaveRequest(formData);
      alert('Leave request submitted successfully');
      setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      alert('Error submitting request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading leave types...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="leave-form">
      <h3>Submit Leave Request</h3>
      <div className="form-group">
        <label>Leave Type:</label>
        <select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
          <option value="">Select</option>
          {leaveTypes.map(lt => (
            <option key={lt._id} value={lt.name}>
              {lt.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Start Date:</label>
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>End Date:</label>
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Reason:</label>
        <textarea name="reason" value={formData.reason} onChange={handleChange} required />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

export default LeaveForm;