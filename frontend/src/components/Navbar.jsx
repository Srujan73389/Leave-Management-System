import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/">Home</Link>
        {user && user.role === 'employee' && <Link to="/employee">Dashboard</Link>}
        {user && user.role === 'employer' && <Link to="/employer">Dashboard</Link>}
      </div>
      <div className="user-info">
        {user ? (
          <>
            <span>Hello, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;