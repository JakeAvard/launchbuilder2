import React from 'react';

export default function OrgCard({ name, category, donated, impact, distance, rating, mission, recommended }) {
  return (
    <div className={`org-card ${recommended ? 'recommended' : ''}`}>
      {recommended && <div className="recommended-badge">Recommended</div>}
      <div className="org-header">
        <h3>{name}</h3>
        <span className="org-category">{category}</span>
      </div>
      {mission && <p className="org-mission">{mission}</p>}
      <div className="org-details">
        {donated !== undefined && (
          <div className="org-stat">
            <span className="stat-label">Donated:</span>
            <span className="stat-value">${donated}</span>
          </div>
        )}
        {rating && (
          <div className="org-stat">
            <span className="stat-label">Rating:</span>
            <span className="stat-value">⭐ {rating}</span>
          </div>
        )}
        {impact && (
          <div className="org-impact">{impact}</div>
        )}
        {distance && (
          <div className="org-distance">📍 {distance}</div>
        )}
      </div>
      <button className="btn-primary">Learn More</button>
    </div>
  );
}
