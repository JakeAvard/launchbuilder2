import React from 'react';

export default function ImpactCard({ metric, value, icon }) {
  return (
    <div className="impact-card">
      <div className="impact-icon">{icon}</div>
      <div className="impact-value">{value}</div>
      <div className="impact-metric">{metric}</div>
    </div>
  );
}
