import React from 'react';

export default function AlertCard({ title, message, date, type }) {
  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'progress': return '📈';
      case 'info': return 'ℹ️';
      case 'upcoming': return '⏰';
      case 'discover': return '🔍';
      default: return '🔔';
    }
  };

  return (
    <div className={`alert-card alert-${type}`}>
      <div className="alert-icon">{getIcon()}</div>
      <div className="alert-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <span className="alert-date">{date}</span>
      </div>
    </div>
  );
}
