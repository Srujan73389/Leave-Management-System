import React, { useState, useEffect } from 'react';
import { getLeaveTypes, deleteLeaveType, updateLeaveType } from '../services/leaveTypeService';

const ManageLeaveType = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchLeaveTypes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLeaveTypes();
      setLeaveTypes(data);
    } catch (err) {
      setError('Failed to load leave types');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      try {
        await deleteLeaveType(id);
        setSuccessMessage('SUCCESS: Leave type deleted successfully');
        fetchLeaveTypes();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        alert('Error deleting leave type');
      }
    }
  };

  const startEdit = (lt) => {
    setEditingId(lt._id);
    setEditForm({ name: lt.name, description: lt.description });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '' });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      await updateLeaveType(id, editForm);
      setSuccessMessage('SUCCESS: Leave type updated successfully');
      setEditingId(null);
      fetchLeaveTypes();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error updating leave type');
    }
  };

  return (
    <div className="manage-leave-type-container">
      <h2>MANAGE LEAVE TYPE</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="leave-type-info">
        <h3>LEAVE TYPE INFO</h3>
        <div className="table-controls">
          <div className="show-entries">
            <span>Show </span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span> entries</span>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sr no</th>
                <th>Leave Type</th>
                <th>Description</th>
                <th>Creation Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" style={{ color: 'red' }}>{error}</td></tr>
              ) : leaveTypes.length > 0 ? (
                leaveTypes.slice(0, entriesPerPage).map((lt, index) => (
                  <tr key={lt._id}>
                    <td>{index + 1}</td>
                    <td>
                      {editingId === lt._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                        />
                      ) : lt.name}
                    </td>
                    <td>
                      {editingId === lt._id ? (
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          rows="2"
                        />
                      ) : lt.description}
                    </td>
                    <td>{new Date(lt.createdAt).toLocaleString()}</td>
                    <td>
                      {editingId === lt._id ? (
                        <>
                          <button className="action-btn" onClick={() => saveEdit(lt._id)}>💾</button>
                          <button className="action-btn" onClick={cancelEdit}>❌</button>
                        </>
                      ) : (
                        <>
                          <button className="action-btn" onClick={() => startEdit(lt)}>✏️</button>
                          <button className="action-btn" onClick={() => handleDelete(lt._id)}>🗑️</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">No leave types found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-info">
          Showing 1 to {Math.min(leaveTypes.length, entriesPerPage)} of {leaveTypes.length} entries
        </div>
      </div>
    </div>
  );
};

export default ManageLeaveType;