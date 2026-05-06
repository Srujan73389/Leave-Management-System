import React, { useState, useEffect } from 'react';
import { getAllLeaveRequests, reviewRequest, deleteLeaveRequest } from '../services/employerService';

const DashboardOverview = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [editingRequest, setEditingRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await getAllLeaveRequests();
      setRequests(data);
      const total = data.length;
      const pending = data.filter(req => req.status === 'pending').length;
      const approved = data.filter(req => req.status === 'approved').length;
      const rejected = data.filter(req => req.status === 'rejected').length;
      setStats({ total, pending, approved, rejected });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatDateForDisplay = (date) => {
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  };

  // Tooltip render for employee names
  const renderEmployeeWithTooltip = (user) => {
    if (!user) return 'N/A';

    return (
      <div className="employee-tooltip-container">
        <span className="employee-name">{user.name || 'N/A'}</span>
        <div className="employee-tooltip">
          <div className="tooltip-header">Employee Details</div>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span className="tooltip-label">Employee ID:</span>
              <span className="tooltip-value">{user.employeeId || 'N/A'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Name:</span>
              <span className="tooltip-value">{user.name || 'N/A'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Email:</span>
              <span className="tooltip-value">{user.email || 'N/A'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Gender:</span>
              <span className="tooltip-value">{user.gender || 'N/A'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Phone:</span>
              <span className="tooltip-value">{user.phone || 'N/A'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Department:</span>
              <span className="tooltip-value">{user.department || 'N/A'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">City:</span>
              <span className="tooltip-value">{user.city || 'N/A'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Country:</span>
              <span className="tooltip-value">{user.country || 'N/A'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Address:</span>
              <span className="tooltip-value">{user.address || 'N/A'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Birthdate:</span>
              <span className="tooltip-value">{formatDateForDisplay(user.birthdate)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleEditClick = (req) => {
    setEditingRequest(req);
    setNewStatus(req.status);
    setShowModal(true);
  };

  const handleSaveStatus = async () => {
    if (!editingRequest) return;
    try {
      await reviewRequest(editingRequest._id, newStatus);
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        await deleteLeaveRequest(id);
        fetchRequests();
      } catch (err) {
        alert('Error deleting request');
      }
    }
  };

  return (
    <>
      <div className="content-header">
        <div className="admin-title">
          <div className="admin-avatar">A</div>
          <h1>Admin</h1>
        </div>
        <p className="subtitle">Employer Overview – Review all employee leave requests and decide quickly.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-details">
            <span className="stat-label">Total Requests</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-details">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span> {/* 👈 Now just a number, not a link */}
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <span className="stat-label">Approved</span>
            <span className="stat-value">{stats.approved}</span>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-details">
            <span className="stat-label">Rejected</span>
            <span className="stat-value">{stats.rejected}</span>
          </div>
        </div>
      </div>

      <div className="info-row">
        <div className="totals-card">
          <h3>Totals</h3>
          <div className="totals-item">
            <span>Pending</span>
            <span>{stats.pending}</span>
          </div>
          <div className="totals-item">
            <span>Approved</span>
            <span>{stats.approved}</span>
          </div>
          <div className="totals-item">
            <span>Rejected</span>
            <span>{stats.rejected}</span>
          </div>
        </div>
        <div className="action-card">
          <h3>Needs Action</h3>
          <div className="needs-action">{stats.pending} request{stats.pending !== 1 ? 's' : ''} pending</div>
        </div>
      </div>

      <div className="employees-card">
        <h2>Employee Leave Requests</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map(req => (
                  <tr key={req._id}>
                    <td>{renderEmployeeWithTooltip(req.user)}</td>
                    <td>{req.user?.email || 'N/A'}</td>
                    <td>{req.leaveType}</td>
                    <td>{`${formatDate(req.startDate)} - ${formatDate(req.endDate)}`}</td>
                    <td>{req.reason}</td>
                    <td>
                      <span className={`status-badge status-${req.status}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn"
                          onClick={() => handleEditClick(req)}
                          title="Edit Status"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => handleDelete(req._id)}
                          title="Delete Request"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7">No leave requests found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {showModal && editingRequest && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h3>Edit Leave Status</h3>
            <div className="form-group">
              <label>Current Status</label>
              <input type="text" value={editingRequest.status} disabled />
            </div>
            <div className="form-group">
              <label>New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="save-btn" onClick={handleSaveStatus}>Save</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardOverview;