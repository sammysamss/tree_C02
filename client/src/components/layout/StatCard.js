import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, color }) => {
  const getIcon = () => {
    switch (icon) {
      case 'tree':
        return <i className="fas fa-tree"></i>;
      case 'cloud':
        return <i className="fas fa-cloud"></i>;
      case 'check-circle':
        return <i className="fas fa-check-circle"></i>;
      case 'exclamation-triangle':
        return <i className="fas fa-exclamation-triangle"></i>;
      case 'times-circle':
        return <i className="fas fa-times-circle"></i>;
      default:
        return <i className="fas fa-chart-line"></i>;
    }
  };

  return (
    <div className={`stat-card ${color ? `stat-card-${color}` : ''}`}>
      <div className="stat-icon">
        {getIcon()}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;