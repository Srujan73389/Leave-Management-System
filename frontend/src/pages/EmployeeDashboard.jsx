import React, { useState, useEffect } from 'react';
import LeaveForm from '../components/LeaveForm';
import { getMyLeaveRequests } from '../services/employeeService';

const EmployeeDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const fetchRequests = async () => {
    try {
      const data = await getMyLeaveRequests();
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

  // Filter requests based on selected filter
  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  // Helper to calculate duration in days
  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return diffDays;
  };

  return (
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <h1>Overview</h1>
        <p className="subtitle">Manage your leave requests and track your status.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Total Requests</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-label">Approved</span>
            <span className="stat-value">{stats.approved}</span>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <span className="stat-label">Rejected</span>
            <span className="stat-value">{stats.rejected}</span>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="dashboard-grid">
        {/* Left Column: Recent Requests */}
        <div className="recent-requests-card">
          <h2>Recent Requests</h2>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
            <button
              className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected
            </button>
          </div>

          {/* Table with Type, Dates, Duration, Status */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map(req => (
                    <tr key={req._id}>
                      <td>{req.leaveType}</td>
                      <td>
                        {new Date(req.startDate).toLocaleDateString()} -{' '}
                        {new Date(req.endDate).toLocaleDateString()}
                      </td>
                      <td>{calculateDuration(req.startDate, req.endDate)} day(s)</td>
                      <td>
                        <span className={`status-badge status-${req.status}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: New Request Form */}
        <div className="new-request-card">
          <h2>New Request</h2>
          <LeaveForm onSuccess={fetchRequests} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;