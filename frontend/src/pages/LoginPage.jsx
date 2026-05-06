import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';

const LoginPage = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password, role);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      if (data.role === 'employee') navigate('/employee');
      else navigate('/employer');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, position, role);
      alert('Account created successfully! Please login.');
      setIsLogin(true);
      setEmail(email);
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setPosition('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
        <p className="subtitle">
          {isLogin ? 'Please enter your details to sign in.' : 'Fill in the details to register.'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="role-switch">
          <button
            className={`role-btn ${role === 'employee' ? 'active' : ''}`}
            onClick={() => setRole('employee')}
            type="button"
          >
            Employee
          </button>
          <button
            className={`role-btn ${role === 'employer' ? 'active' : ''}`}
            onClick={() => setRole('employer')}
            type="button"
          >
            Employer
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signin-btn">Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>FULL NAME</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>POSITION / JOB TITLE</label>
              <input
                type="text"
                placeholder="e.g., Software Engineer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>
            {/* Role is already selected via tabs */}
            <button type="submit" className="signin-btn">Sign Up</button>
          </form>
        )}

        <div className="toggle-section">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button type="button" className="toggle-btn" onClick={toggleMode}>
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;