import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../store/authSlice';
import Button from '../../components/Button/Button';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="auth-container bg-dark">
      <div className="auth-panel bg-light">
        <h1 className="t-section-title auth-title">System Access</h1>
        <p className="t-label-upper description">Enter your credentials</p>

        {error && <div className="auth-error t-micro-label">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="t-label-upper">Email</label>
            <input 
              className="form-input" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="t-label-upper">Password</label>
            <input 
              className="form-input" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" variant="primary" className="auth-btn">LOGIN</Button>
        </form>

        <div className="auth-footer">
           <span className="t-micro-label">Not a registered entity?</span>
           <Link to="/register" className="auth-link t-ui-heading">CREATE ACCOUNT</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
