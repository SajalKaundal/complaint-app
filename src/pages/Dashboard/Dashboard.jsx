import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../../components/Badge/Badge';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { role } = useSelector(state => state.auth);
  const complaints = useSelector(state => state.complaints.list);
  const navigate = useNavigate();

  const filteredComplaints = role === 'admin' 
      ? complaints 
      : complaints.filter(c => c.id !== 'invisible_admin_only_logic_for_now'); 
      // In a real app we'd filter by user id, assuming all are user 1 for now

  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const escalated = complaints.filter(c => c.escalated || c.critical).length;

  return (
    <div className="dashboard-container">
      {/* Cinematic Hero Section */}
      <section className="dashboard-hero bg-dark">
        <div className="hero-content">
          <h1 className="t-section-title">Overview</h1>
          <p className="t-label-upper summary-label">Issue Matrix</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{pending}</span>
              <span className="t-label-upper">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{inProgress}</span>
              <span className="t-label-upper">In Progress</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{resolved}</span>
              <span className="t-label-upper">Resolved</span>
            </div>
            <div className="stat-card stat-alert">
              <span className="stat-number">{escalated}</span>
              <span className="t-label-upper">Escalated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial List Section */}
      <section className="dashboard-list bg-light">
        <div className="list-header">
           <h2 className="t-card-heading">Recent Complaints</h2>
           {role === 'admin' && <span className="t-micro-label">ADMIN VIEW</span>}
        </div>

        <div className="complaints-grid">
          {filteredComplaints.map(item => (
            <div key={item.id} className="complaint-card" onClick={() => navigate(`/complaint/${item.id}`)}>
               <div className="card-top">
                 <span className="t-label-upper category-tag">{item.category}</span>
                 <div className="card-badges">
                    {item.critical && <Badge type="critical" text="Critical (>48h)" />}
                    {!item.critical && item.escalated && <Badge type="escalated" text="Escalated (>24h)" />}
                    <Badge type={item.priority.toLowerCase()} text={item.priority} />
                 </div>
               </div>
               <h3 className="t-ui-heading item-title">{item.title}</h3>
               <div className="card-bottom">
                 <span className="t-micro-label id-tag">{item.id}</span>
                 <div className="status-indicator">
                    {item.status === 'Pending' && <Clock size={14} />}
                    {item.status === 'In Progress' && <AlertTriangle size={14} />}
                    {item.status === 'Resolved' && <CheckCircle2 size={14} />}
                    <span className="t-label-upper">{item.status}</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
