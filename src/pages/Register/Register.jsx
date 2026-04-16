import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../../store/authSlice';
import Button from '../../components/Button/Button';
import '../Login/Login.css'; // Reusing layout CSS

const Register = () => {
  const [name, setName] = useState('');
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
    dispatch(register({ name, email, password }));
  };

  return (
    <div className="auth-container bg-dark">
      <div className="auth-panel bg-light">
        <h1 className="t-section-title auth-title">Initial Registration</h1>
        <p className="t-label-upper description">Restricted to @college.edu personnel</p>

        {error && <div className="auth-error t-micro-label">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="t-label-upper">Full Name</label>
            <input 
              className="form-input" 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="t-label-upper">College Email</label>
            <input 
              className="form-input" 
              type="email" 
              placeholder="e.g. user@college.edu"
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
          
          <Button type="submit" variant="primary" className="auth-btn">CREATE ACCOUNT</Button>
        </form>

        <div className="auth-footer">
           <span className="t-micro-label">Already registered?</span>
           <Link to="/login" className="auth-link t-ui-heading">LOGIN HERE</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
