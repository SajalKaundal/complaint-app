import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./Dashboard.css";

import Badge from "../../components/Badge/Badge";
import { Clock, AlertTriangle, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";

const PublicDashboard = () => {
  const complaints = useSelector((state) => state.complaints.list);
  const filteredComplaints = complaints.filter((c) => c.isPublic);
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress",
  ).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const escalated = complaints.filter((c) => c.escalated || c.critical).length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-scroll logic: visible for 3 seconds
  useEffect(() => {
    if (!isAutoPlay || filteredComplaints.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredComplaints.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlay, filteredComplaints.length]);

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % filteredComplaints.length);
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex(
      (prev) => (prev - 1 + filteredComplaints.length) % filteredComplaints.length
    );
  };

  return (
    <>
      <div className="dashboard-container public-dashboard">
        {/* Cinematic Hero Section */}
        <section className="dashboard-hero bg-dark">
          <div className="hero-content">
            <h1 className="t-section-title">Public Issues</h1>
            <p className="t-label-upper summary-label">
              Transparent view for common problems
            </p>

            <div className="stats-grid compact-stats">
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

        {/* Editorial List Section (Carousel Mode) */}
        <section className="dashboard-list auto-scroll-section bg-light">
          {filteredComplaints.length > 0 && (
            <div className="carousel-controls">
              <button className="carousel-btn" onClick={handlePrev} title="Previous">
                <ChevronUp size={24} />
              </button>
              <button className="carousel-btn" onClick={handleNext} title="Next">
                <ChevronDown size={24} />
              </button>
            </div>
          )}
          
          <div className="auto-scroll-container">
            <div 
              className="auto-scroll-track" 
              style={{ transform: `translateY(-${currentIndex * 100}%)` }}
            >
              {filteredComplaints.map((item) => (
                <div key={item.id} className="complaint-card large-card">
                  <div className="card-top">
                    <span className="t-label-upper category-tag">
                      {item.category}
                    </span>
                    <div className="card-badges">
                      {item.critical && (
                        <Badge type="critical" text="Critical (>48h)" />
                      )}
                      {!item.critical && item.escalated && (
                        <Badge type="escalated" text="Escalated (>24h)" />
                      )}
                      <Badge
                        type={item.priority.toLowerCase()}
                        text={item.priority}
                      />
                    </div>
                  </div>
                  <h3 className="t-ui-heading item-title large-title">{item.title}</h3>
                  <div className="card-bottom">
                    <span className="t-micro-label id-tag">Ticket: {item.id}</span>
                    <div className="status-indicator">
                      {item.status === "Pending" && <Clock size={16} />}
                      {item.status === "In Progress" && (
                        <AlertTriangle size={16} />
                      )}
                      {item.status === "Resolved" && <CheckCircle2 size={16} />}
                      <span className="t-label-upper">{item.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PublicDashboard;
