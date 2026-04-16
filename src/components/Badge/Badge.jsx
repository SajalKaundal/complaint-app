import React from 'react';
import './Badge.css';

const Badge = ({ type, text }) => {
  return (
    <span className={`badge badge-${type.toLowerCase()} t-micro-label`}>
      {text}
    </span>
  );
};

export default Badge;
