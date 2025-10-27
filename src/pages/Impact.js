import React, { useState } from 'react';
import TrendChart from '../components/TrendChart';
import ImpactCard from '../components/ImpactCard';

export default function Impact() {
  const [timeRange, setTimeRange] = useState('month');

  const impactStats = [
    { metric: 'People Fed', value: '5,200', icon: '🍽️' },
    { metric: 'Students Educated', value: '150', icon: '📚' },
    { metric: 'Trees Planted', value: '1,000', icon: '🌳' },
    { metric: 'Animals Rescued', value: '42', icon: '🐾' },
    { metric: 'Medical Treatments', value: '380', icon: '⚕️' },
    { metric: 'Families Housed', value: '25', icon: '🏠' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Your Impact</h1>
        <div className="time-range-selector">
          <button
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={timeRange === 'year' ? 'active' : ''}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="impact-summary">
        <div className="summary-card">
          <h2>Together, You've Made a Difference</h2>
          <p>Your contributions have created real, measurable change in communities around the world.</p>
        </div>
      </div>

      <div className="chart-container">
        <h2>Impact Over Time</h2>
        <TrendChart timeRange={timeRange} />
      </div>

      <div className="section">
        <h2>Impact Breakdown</h2>
        <div className="impact-grid">
          {impactStats.map((stat, idx) => (
            <ImpactCard
              key={idx}
              metric={stat.metric}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Stories of Impact</h2>
        <div className="stories-container">
          <div className="story-card">
            <div className="story-image">🌊</div>
            <h3>Clean Water in Rural Villages</h3>
            <p>Your donations helped install 5 water filtration systems, providing clean water to 1,200 people in remote areas.</p>
          </div>
          <div className="story-card">
            <div className="story-image">📖</div>
            <h3>School Libraries Stocked</h3>
            <p>Thanks to your support, 3 school libraries received 500 new books, inspiring young readers.</p>
          </div>
          <div className="story-card">
            <div className="story-image">🏥</div>
            <h3>Mobile Health Clinics</h3>
            <p>Your contributions funded 12 mobile clinic visits, providing healthcare to underserved communities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
