import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import './Header.css';

const Header = () => {
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="site-header">
      <div className="header-content">
        <Link to="/" className="brand-logo">
          <div className="logo-box">
             <span className="dummy-horse">★</span>
          </div>
          <span className="brand-text">SMART COMPLAINTS</span>
        </Link>
        
        {isAuthenticated && (
            <nav className="header-nav">
            {currentUser?.role === 'user' && (
                <Link to="/report" className="nav-link t-ui-heading">REPORT ISSUE</Link>
            )}
            <span className="nav-divider">|</span>
            <div className="user-controls">
                <span className="user-info t-micro-label">{currentUser?.role === 'admin' ? 'ADMIN' : currentUser?.name}</span>
                <button className="role-toggle t-micro-label" onClick={handleLogout}>
                LOGOUT
                </button>
            </div>
            </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
