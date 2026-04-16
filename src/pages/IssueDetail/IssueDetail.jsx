import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateStatus, addRemark } from '../../store/complaintSlice';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import MergeModal from '../../components/MergeModal/MergeModal';
import { ArrowLeft } from 'lucide-react';
import './IssueDetail.css';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  
  const complaint = useSelector(state => 
    state.complaints.list.find(c => c.id === id)
  );

  const [newRemark, setNewRemark] = useState('');
  const [showMerge, setShowMerge] = useState(false);

  if (!complaint) return <div className="detail-container">Complaint not found</div>;

  const handleStatusUpdate = (status) => {
    dispatch(updateStatus({ id, status }));
  };

  const handleAddRemark = () => {
    if(!newRemark.trim()) return;
    dispatch(addRemark({ id, remark: `[${currentUser?.role === 'admin' ? 'STAFF' : 'USER'}] ${newRemark}` }));
    setNewRemark('');
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <div className="detail-container">
      {showMerge && <MergeModal sourceId={complaint.id} onClose={() => setShowMerge(false)} />}
      
      {/* Header section (dark cinematic split) */}
      <section className="detail-header bg-dark">
        <div className="detail-content">
          <button className="back-link" onClick={() => navigate('/')}>
             <ArrowLeft size={16} /> <span className="t-micro-label">BACK TO DASHBOARD</span>
          </button>
          
          <div className="title-area">
             <div className="title-meta">
               <span className="t-label-upper id-badge">{complaint.id}</span>
               <span className="t-label-upper category-badge">{complaint.category}</span>
             </div>
             <h1 className="t-section-title title-text">{complaint.title}</h1>
             <div className="status-badges">
                <Badge type={complaint.priority.toLowerCase()} text={`${complaint.priority} Priority`} />
                {complaint.critical && <Badge type="critical" text="Critical (>48h)" />}
                {!complaint.critical && complaint.escalated && <Badge type="escalated" text="Escalated (>24h)" />}
                
                {complaint.status === 'Pending Verification' ? (
                    <Badge type="escalated" text="AWAITING USER CLOSURE" />
                ) : (
                    <Badge 
                        type={
                            complaint.status === 'Resolved' ? 'resolved' :
                            complaint.status === 'In Progress' ? 'in' : 'pending'
                        } 
                        text={`Status: ${complaint.status}`} 
                    />
                )}
             </div>
          </div>
        </div>
      </section>

      {/* Editorial content section */}
      <section className="detail-body bg-light">
        <div className="detail-content body-layout">
           
           <div className="main-column">
              {complaint.image && (
                 <div className="complaint-image-box">
                    <img src={complaint.image} alt="Complaint Issue" className="complaint-img" />
                 </div>
              )}
           
              <h2 className="t-ui-heading section-label">Description</h2>
              <p className="description-text">{complaint.description}</p>

              <h2 className="t-ui-heading section-label">Timeline / Remarks</h2>
              <div className="timeline">
                 <div className="timeline-item">
                    <span className="t-micro-label time-meta">{formatDate(complaint.createdAt)}</span>
                    <p className="timeline-text">Complaint submitted by User.</p>
                 </div>
                 {complaint.remarks.map((rmk, idx) => (
                    <div key={idx} className="timeline-item">
                        <span className="t-micro-label time-meta">UPDATE</span>
                        <p className="timeline-text">{rmk}</p>
                    </div>
                 ))}
              </div>

              {complaint.status !== 'Resolved' && (
                  <div className="add-remark">
                    <textarea 
                        className="form-input" 
                        placeholder="Add a remark or update..."
                        value={newRemark}
                        onChange={(e) => setNewRemark(e.target.value)}
                        rows="3"
                    ></textarea>
                    <Button variant="primary" onClick={handleAddRemark}>SUBMIT REMARK</Button>
                  </div>
              )}

              {/* User Verification Action */}
              {currentUser?.role === 'user' && complaint.status === 'Pending Verification' && (
                  <div className="user-verify-box" style={{ marginTop: '40px', padding: '24px', backgroundColor: '#F0F9F5', border: '1px solid #03904A' }}>
                      <h3 className="t-ui-heading" style={{color: '#03904A', marginBottom: '8px'}}>Admin Requested Closure</h3>
                      <p className="description-text" style={{fontSize: '14px', marginBottom: '16px'}}>Please verify that this issue has been successfully resolved.</p>
                      <div style={{display: 'flex', gap: '12px'}}>
                         <Button variant="accent" onClick={() => handleStatusUpdate('Resolved')}>CONFIRM RESOLVED</Button>
                         <Button variant="ghost" onClick={() => handleStatusUpdate('In Progress')}>ISSUE STILL PERSISTS</Button>
                      </div>
                  </div>
              )}
           </div>

           {/* Admin Sidebar */}
           {currentUser?.role === 'admin' && (
               <div className="side-column">
                  <div className="admin-panel">
                     <h3 className="t-label-upper panel-title">Admin Controls</h3>
                     
                     <div className="control-group">
                        <span className="t-micro-label control-label">Update Status</span>
                        <div className="status-buttons">
                           <Button 
                              variant={complaint.status === 'Pending' ? 'primary' : 'ghost'} 
                              onClick={() => handleStatusUpdate('Pending')}
                           >PENDING</Button>
                           <Button 
                              variant={complaint.status === 'In Progress' ? 'primary' : 'ghost'} 
                              onClick={() => handleStatusUpdate('In Progress')}
                           >IN PROGRESS</Button>
                           
                           {/* Verify/Close Logic */}
                           <Button 
                              variant={complaint.status === 'Pending Verification' ? 'accent' : 'ghost'} 
                              onClick={() => handleStatusUpdate('Pending Verification')}
                           >NOTIFY USER TO CLOSE</Button>

                           <Button 
                              variant={complaint.status === 'Resolved' ? 'accent' : 'ghost'} 
                              onClick={() => handleStatusUpdate('Resolved')}
                           >FORCE RESOLVE</Button>
                        </div>
                     </div>

                     {complaint.status !== 'Resolved' && (
                         <div className="control-group" style={{marginTop: '32px'}}>
                            <span className="t-micro-label control-label" style={{color: 'var(--f-color-accessible-warning)'}}>Advanced</span>
                            <Button variant="ghost" onClick={() => setShowMerge(true)}>MERGE DUPLICATE</Button>
                         </div>
                     )}
                  </div>
               </div>
           )}

        </div>
      </section>
    </div>
  );
};

export default IssueDetail;
