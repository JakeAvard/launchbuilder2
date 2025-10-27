import React from 'react';

export default function CampaignCard({ title, goal, raised, recurring }) {
  const percentage = (raised / goal) * 100;

  return (
    <div className="campaign-card">
      <div className="campaign-header">
        <h3>{title}</h3>
        {recurring && <span className="recurring-badge">Recurring</span>}
      </div>
      <div className="campaign-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="progress-labels">
          <span>${raised.toLocaleString()} raised</span>
          <span>${goal.toLocaleString()} goal</span>
        </div>
      </div>
      <button className="btn-secondary">View Details</button>
    </div>
  );
}
