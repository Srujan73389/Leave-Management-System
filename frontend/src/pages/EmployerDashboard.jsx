import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLeaveRequests, reviewRequest } from '../services/employerService';

const EmployerDashboard = ({ setUser }) => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();

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

  const handleApprove = async (id) => {
    try {
      await reviewRequest(id, 'approved');
      fetchRequests();
    } catch (err) {
      alert('Error approving request');
    }
  };

  const handleReject = async (id) => {
    try {
      await reviewRequest(id, 'rejected');
      fetchRequests();
    } catch (err) {
      alert('Error rejecting request');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // Menu configuration – removed Leave Management, added nested for Leave Type and Employees
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '#' },
    {
      key: 'department',
      label: 'Department',
      icon: '🏢',
      children: [
        { key: 'add-dept', label: 'Add Department', icon: '➕', path: '#' },
        { key: 'manage-dept', label: 'Manage Department', icon: '📋', path: '#' }
      ]
    },
    {
      key: 'leave-type',
      label: 'Leave Type',
      icon: '📋',
      children: [
        { key: 'add-leave', label: 'Add Leave Type', icon: '➕', path: '#' },
        { key: 'manage-leave', label: 'Manage Leave Type', icon: '📋', path: '#' }
      ]
    },
    {
      key: 'employees',
      label: 'Employees',
      icon: '👥',
      children: [
        { key: 'add-emp', label: 'Add Employee', icon: '➕', path: '#' },
        { key: 'manage-emp', label: 'Manage Employee', icon: '👤', path: '#' }
      ]
    },
    { key: 'change-pwd', label: 'Change Password', icon: '🔐', path: '#' },
    { key: 'signout', label: 'Sign Out', icon: '🚪', path: '#', isSignOut: true }
  ];

  const renderMenuItems = (items, level = 0) => {
    return items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedMenus[item.key];

      if (item.isSignOut) {
        return (
          <li key={item.key} className="signout-item">
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              <span className="menu-icon">{item.icon}</span> {item.label}
            </a>
          </li>
        );
      }

      return (
        <React.Fragment key={item.key}>
          <li>
            <a
              href={item.path}
              onClick={(e) => {
                if (hasChildren) {
                  e.preventDefault();
                  toggleMenu(item.key);
                }
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {hasChildren && (
                <span className="menu-arrow">
                  {isExpanded ? '▼' : '▶'}
                </span>
              )}
            </a>
          </li>
          {hasChildren && isExpanded && (
            <ul className="submenu">
              {renderMenuItems(item.children, level + 1)}
            </ul>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="employer-layout">
      {/* Sidebar */}
      <aside className="employer-sidebar">
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {renderMenuItems(menuItems)}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <p>© 2026 Admin Panel</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="employer-main">
        <div className="content-header">
          <div className="admin-title">
            <div className="admin-avatar">A</div>
            <h1>Admin</h1>
          </div>
          <p className="subtitle">Employer Overview – Review all employee leave requests and decide quickly.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total-icon">📋</div>
            <div className="stat-details">
              <span className="stat-label">Total Requests</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending-icon">⏳</div>
            <div className="stat-details">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon approved-icon">✅</div>
            <div className="stat-details">
              <span className="stat-label">Approved</span>
              <span className="stat-value">{stats.approved}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rejected-icon">❌</div>
            <div className="stat-details">
              <span className="stat-label">Rejected</span>
              <span className="stat-value">{stats.rejected}</span>
            </div>
          </div>
        </div>

        {/* Totals and Needs Action */}
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

        {/* Employees Table */}
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
                      <td>{req.user?.name || 'N/A'}</td>
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
                        {req.status === 'pending' ? (
                          <div className="action-buttons">
                            <button className="btn-approve" onClick={() => handleApprove(req._id)}>Approve</button>
                            <button className="btn-reject" onClick={() => handleReject(req._id)}>Reject</button>
                          </div>
                        ) : (
                          <span className="no-action">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No leave requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;