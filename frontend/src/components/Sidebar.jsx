import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ setUser }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '/employer' },
    {
      key: 'department',
      label: 'Department',
      icon: '🏢',
      children: [
        { key: 'add-dept', label: 'Add Department', icon: '➕', path: '/employer/department/add' },
        { key: 'manage-dept', label: 'Manage Department', icon: '📋', path: '/employer/department/manage' }
      ]
    },
    {
      key: 'leave-type',
      label: 'Leave Type',
      icon: '📋',
      children: [
        { key: 'add-leave', label: 'Add Leave Type', icon: '➕', path: '/employer/leave-type/add' },
        { key: 'manage-leave', label: 'Manage Leave Type', icon: '📋', path: '/employer/leave-type/manage' }
      ]
    },
    {
      key: 'employees',
      label: 'Employees',
      icon: '👥',
      children: [
        { key: 'add-emp', label: 'Add Employee', icon: '➕', path: '/employer/employees/add' },
        { key: 'manage-emp', label: 'Manage Employee', icon: '👤', path: '/employer/employees/manage' }
      ]
    },
    { key: 'change-pwd', label: 'Change Password', icon: '🔐', path: '/employer/change-password' }
  ];

  const renderMenuItems = (items, level = 0) => {
    return items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedMenus[item.key];

      return (
        <React.Fragment key={item.key}>
          <li>
            <Link
              to={item.path}
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
            </Link>
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
    <aside className="employer-sidebar">
      <div className="sidebar-header">
        <h2>Menu</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {renderMenuItems(menuItems)}
          <li className="signout-item">
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              <span className="menu-icon">🚪</span> Sign Out
            </a>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>© 2026 Admin Panel</p>
      </div>
    </aside>
  );
};

export default Sidebar;