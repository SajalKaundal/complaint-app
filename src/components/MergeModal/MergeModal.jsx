import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { mergeComplaints } from '../../store/complaintSlice';
import Button from '../Button/Button';
import './MergeModal.css';

const MergeModal = ({ sourceId, onClose }) => {
  const [destinationId, setDestinationId] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get all active complaints except the current one
  const activeComplaints = useSelector(state => 
    state.complaints.list.filter(c => c.status !== 'Resolved' && c.id !== sourceId)
  );

  const handleMerge = () => {
    if (!destinationId) return;
    dispatch(mergeComplaints({ sourceId, destinationId }));
    onClose();
    navigate('/'); // Back to dashboard since this is resolved now
  };

  return (
    <div className="merge-overlay">
      <div className="merge-container bg-light">
        <h2 className="t-card-heading">Merge Complaint</h2>
        <p className="t-micro-label description">Move this duplicate into an active master complaint.</p>
        
        <div className="custom-select-wrapper merge-select">
          <select 
            className="form-input" 
            value={destinationId} 
            onChange={e => setDestinationId(e.target.value)}
          >
            <option value="" disabled>Select Master Ticket</option>
            {activeComplaints.map(c => (
              <option key={c.id} value={c.id}>[{c.id}] {c.title.substring(0, 30)}...</option>
            ))}
          </select>
        </div>

        <div className="merge-actions">
           <Button variant="ghost" onClick={onClose}>CANCEL</Button>
           <Button variant="primary" onClick={handleMerge} disabled={!destinationId}>CONFIRM MERGE</Button>
        </div>
      </div>
    </div>
  );
};

export default MergeModal;
