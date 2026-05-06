import React, { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee, updateEmployee, viewEmployeePassword } from '../services/employeeMgmtService';
import { getDepartments } from '../services/departmentService';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [viewedPassword, setViewedPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to load departments');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    return (
      emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + entriesPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        setSuccessMessage('SUCCESS: Employee deleted successfully');
        fetchEmployees();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        alert('Error deleting employee');
      }
    }
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setEditForm({
      employeeId: emp.employeeId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      city: emp.city || '',
      phone: emp.phone || '',
      department: emp.department || '',
      gender: emp.gender || '',
      birthdate: emp.birthdate ? emp.birthdate.split('T')[0] : '',
      address: emp.address || '',
      country: emp.country || '',
      status: emp.status || 'ACTIVE'
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      await updateEmployee(editingEmployee._id, editForm);
      setSuccessMessage('SUCCESS: Employee updated successfully');
      setShowEditModal(false);
      fetchEmployees();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Error updating employee');
    }
  };

  const openPasswordModal = (id) => {
    setSelectedEmployeeId(id);
    setAdminPassword('');
    setViewedPassword('');
    setPasswordError('');
    setShowPassword(false);
    setShowPasswordModal(true);
  };

  const handleViewPassword = async () => {
    if (!adminPassword) {
      setPasswordError('Please enter admin password');
      return;
    }
    try {
      const data = await viewEmployeePassword(selectedEmployeeId, adminPassword);
      setViewedPassword(data.password);
      setShowPassword(true);
      setPasswordError('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Invalid admin password');
    }
  };

  return (
    <div className="manage-employees-container">
      <h2>MANAGE EMPLOYEES</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="employees-info">
        <h3>EMPLOYEES INFO</h3>

        <div className="table-controls">
          <div className="show-entries">
            <span>Show </span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span> entries</span>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search records"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sr no</th>
                <th>Emp Id</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Reg Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="7" style={{ color: 'red' }}>{error}</td></tr>
              ) : paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{emp.employeeId}</td>
                    <td>{`${emp.firstName || ''} ${emp.lastName || ''}`.trim()}</td>
                    <td>{emp.department || '—'}</td>
                    <td>
                      <span className={`status-badge ${emp.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                        {emp.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td>{new Date(emp.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="action-btn" onClick={() => openEditModal(emp)} title="Edit">✏️</button>
                      <button className="action-btn" onClick={() => handleDelete(emp._id)} title="Delete">🗑️</button>
                      <button className="action-btn" onClick={() => openPasswordModal(emp._id)} title="View Password">👁️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7">No employees found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-info">
          Showing {filteredEmployees.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + entriesPerPage, filteredEmployees.length)} of {filteredEmployees.length} entries
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Employee</h3>
            <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input type="text" name="employeeId" value={editForm.employeeId} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={editForm.firstName} onChange={handleEditChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={editForm.lastName} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={editForm.email} onChange={handleEditChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <select name="department" value={editForm.department} onChange={handleEditChange}>
                    <option value="">Select...</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={editForm.city} onChange={handleEditChange} />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" name="country" value={editForm.country} onChange={handleEditChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={editForm.gender} onChange={handleEditChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Birthdate</label>
                  <input type="date" name="birthdate" value={editForm.birthdate} onChange={handleEditChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={editForm.address} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={editForm.status} onChange={handleEditChange}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h3>Enter Admin Password</h3>
            {!showPassword ? (
              <>
                <div className="form-group">
                  <label>Admin Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter your admin password"
                  />
                </div>
                {passwordError && <div className="error-message">{passwordError}</div>}
                <div className="modal-actions">
                  <button className="save-btn" onClick={handleViewPassword}>Verify</button>
                  <button className="cancel-btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Employee Password</label>
                  <input type="text" value={viewedPassword} readOnly />
                </div>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setShowPasswordModal(false)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;