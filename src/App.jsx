import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkEscalations } from './store/complaintSlice';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import ReportIssue from './pages/ReportIssue/ReportIssue';
import IssueDetail from './pages/IssueDetail/IssueDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

// Layout
import Header from './components/Header/Header';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
        dispatch(checkEscalations());
        const interval = setInterval(() => {
            dispatch(checkEscalations());
        }, 60000); // Check every minute
        return () => clearInterval(interval);
    }
  }, [dispatch, isAuthenticated]);

  return (
    <BrowserRouter>
      <Header />
      <div className="app-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/report" element={isAuthenticated ? <ReportIssue /> : <Navigate to="/login" />} />
          <Route path="/complaint/:id" element={isAuthenticated ? <IssueDetail /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
