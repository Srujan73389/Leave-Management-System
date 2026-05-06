import React, { useState, useEffect } from 'react';
import { getDepartments, deleteDepartment, updateDepartment } from '../services/departmentService';

const ManageDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', shortName: '', code: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      setError('Failed to load departments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id);
        setSuccessMessage('SUCCESS: Department deleted successfully');
        fetchDepartments();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        alert('Error deleting department');
      }
    }
  };

  const startEdit = (dept) => {
    setEditingId(dept._id);
    setEditForm({ name: dept.name, shortName: dept.shortName, code: dept.code });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', shortName: '', code: '' });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      await updateDepartment(id, editForm);
      setSuccessMessage('SUCCESS: Department updated successfully');
      setEditingId(null);
      fetchDepartments();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error updating department');
    }
  };

  return (
    <div className="manage-department-container">
      <h2>MANAGE DEPARTMENTS</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="departments-info">
        <h3>DEPARTMENTS INFO</h3>
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
                <th>Dept Name</th>
                <th>Dept Short Name</th>
                <th>Dept Code</th>
                <th>Creation Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="6" style={{ color: 'red' }}>{error}</td></tr>
              ) : departments.length > 0 ? (
                departments.slice(0, entriesPerPage).map((dept, index) => (
                  <tr key={dept._id}>
                    <td>{index + 1}</td>
                    <td>
                      {editingId === dept._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                        />
                      ) : dept.name}
                    </td>
                    <td>
                      {editingId === dept._id ? (
                        <input
                          type="text"
                          name="shortName"
                          value={editForm.shortName}
                          onChange={handleEditChange}
                        />
                      ) : dept.shortName}
                    </td>
                    <td>
                      {editingId === dept._id ? (
                        <input
                          type="text"
                          name="code"
                          value={editForm.code}
                          onChange={handleEditChange}
                        />
                      ) : dept.code}
                    </td>
                    <td>{new Date(dept.createdAt).toLocaleString()}</td>
                    <td>
                      {editingId === dept._id ? (
                        <>
                          <button className="action-btn" onClick={() => saveEdit(dept._id)}>💾</button>
                          <button className="action-btn" onClick={cancelEdit}>❌</button>
                        </>
                      ) : (
                        <>
                          <button className="action-btn" onClick={() => startEdit(dept)}>✏️</button>
                          <button className="action-btn" onClick={() => handleDelete(dept._id)}>🗑️</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6">No departments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-info">
          Showing 1 to {Math.min(departments.length, entriesPerPage)} of {departments.length} entries
        </div>
      </div>
    </div>
  );
};

export default ManageDepartment;