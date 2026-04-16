import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addComplaint } from '../../store/complaintSlice';
import Button from '../../components/Button/Button';
import './ReportIssue.css';

const ReportIssue = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('electricity');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.auth);

  // Prevent admin from reporting
  if (currentUser?.role === 'admin') {
    return <div className="report-container bg-light"><div className="report-content">Admins cannot report issues. Switch to user.</div></div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    
    dispatch(addComplaint({ title, category, description, image }));
    navigate('/');
  };

  return (
    <div className="report-container bg-light">
      <div className="report-content">
        <div className="form-header">
           <h1 className="t-section-title">Report an Issue</h1>
           <p className="t-label-upper description">Submit your complaint. Priority is auto-assigned.</p>
        </div>

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label className="t-label-upper" htmlFor="title">Issue Title</label>
            <input 
              id="title"
              className="form-input" 
              type="text" 
              placeholder="E.g. No electricity in Room 102"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="t-label-upper" htmlFor="category">Category</label>
            <div className="custom-select-wrapper">
                <select 
                  id="category"
                  className="form-input" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="electricity">Electricity</option>
                  <option value="water">Water / Plumbing</option>
                  <option value="internet">Internet / WiFi</option>
                  <option value="road">Road / Campus</option>
                  <option value="security">Security</option>
                  <option value="hostel">Hostel Maintenance</option>
                  <option value="medical">Medical / Health</option>
                </select>
            </div>
          </div>

          <div className="form-group">
            <label className="t-label-upper" htmlFor="description">Detailed Description</label>
            <textarea 
              id="description"
              className="form-input textarea" 
              rows="5"
              placeholder="Provide all relevant details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="t-label-upper">Attach Image (Optional)</label>
            <div className="file-upload-mock">
               <input 
                  type="file" 
                  accept="image/*" 
                  id="image_upload" 
                  style={{ display: 'none' }} 
                  onChange={handleImageChange}
               />
               <label htmlFor="image_upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  {image ? (
                     <img src={image} alt="Preview" style={{ maxHeight: '120px', objectFit: 'contain' }} />
                  ) : (
                     <span className="t-micro-label file-text">Click to browse or photograph issue</span>
                  )}
               </label>
            </div>
          </div>

          <div className="form-actions">
             <Button variant="ghost" onClick={() => navigate('/')}>CANCEL</Button>
             <Button type="submit" variant="accent">SUBMIT COMPLAINT</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
