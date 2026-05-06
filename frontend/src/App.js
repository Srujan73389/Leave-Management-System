import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployerLayout from './pages/EmployerLayout';
import DashboardOverview from './pages/DashboardOverview';
import AddDepartment from './pages/AddDepartment';
import ManageDepartment from './pages/ManageDepartment';
import AddLeaveType from './pages/AddLeaveType';
import ManageLeaveType from './pages/ManageLeaveType';
import AddEmployee from './pages/AddEmployee';
import ManageEmployees from './pages/ManageEmployees';
import ChangePassword from './pages/ChangePassword';  // 👈 new import
import { getUser } from './utils/auth';

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isEmployerPage = location.pathname.startsWith('/employer');

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <>
      {!isLoginPage && !isEmployerPage && <Navbar user={user} setUser={setUser} />}
      <div className={isLoginPage || isEmployerPage ? '' : 'container'}>
        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/employee" element={user && user.role === 'employee' ? <EmployeeDashboard /> : <Navigate to="/login" />} />
          <Route path="/employer" element={user && user.role === 'employer' ? <EmployerLayout setUser={setUser} /> : <Navigate to="/login" />}>
            <Route index element={<DashboardOverview />} />
            <Route path="department/add" element={<AddDepartment />} />
            <Route path="department/manage" element={<ManageDepartment />} />
            <Route path="leave-type/add" element={<AddLeaveType />} />
            <Route path="leave-type/manage" element={<ManageLeaveType />} />
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/manage" element={<ManageEmployees />} />
            <Route path="change-password" element={<ChangePassword />} />  {/* 👈 new route */}
          </Route>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;