import React, { useState, useEffect } from 'react';
import TrendChart from '../components/TrendChart';
import OrgCard from '../components/OrgCard';
import CampaignCard from '../components/CampaignCard';

export default function Home() {
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    totalGiven: 0,
    orgsSupported: 0,
    recurringImpact: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      const multiplier = timeRange === 'week' ? 1 : timeRange === 'month' ? 4 : 48;
      setStats({
        totalGiven: 1250 * multiplier,
        orgsSupported: timeRange === 'week' ? 3 : timeRange === 'month' ? 5 : 12,
        recurringImpact: 150 * (timeRange === 'month' ? 1 : 12)
      });
    };
    calculateStats();
  }, [timeRange]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
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

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">${stats.totalGiven.toLocaleString()}</div>
          <div className="stat-label">Total Given</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.orgsSupported}</div>
          <div className="stat-label">Organizations Supported</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${stats.recurringImpact.toLocaleString()}/mo</div>
          <div className="stat-label">Recurring Monthly Impact</div>
        </div>
      </div>

      <div className="chart-container">
        <h2>Giving Trend</h2>
        <TrendChart timeRange={timeRange} />
      </div>

      <div className="section">
        <h2>Your Organizations</h2>
        <div className="cards-grid">
          <OrgCard
            name="Clean Water Initiative"
            category="Environment"
            donated={450}
            impact="1,200 people served"
          />
          <OrgCard
            name="Education For All"
            category="Education"
            donated={300}
            impact="50 students supported"
          />
          <OrgCard
            name="Food Bank Network"
            category="Hunger Relief"
            donated={500}
            impact="2,000 meals provided"
          />
        </div>
      </div>

      <div className="section">
        <h2>Your Campaigns</h2>
        <div className="cards-grid">
          <CampaignCard
            title="Monthly Education Drive"
            goal={1000}
            raised={750}
            recurring={true}
          />
          <CampaignCard
            title="Emergency Relief Fund"
            goal={500}
            raised={500}
            recurring={false}
          />
        </div>
      </div>

      <div className="section">
        <h2>Discover Organizations Near You</h2>
        <div className="cards-grid">
          <OrgCard
            name="Local Community Center"
            category="Community"
            distance="0.5 mi"
            impact="Serving 500+ families"
          />
          <OrgCard
            name="Youth Sports Program"
            category="Youth Development"
            distance="1.2 mi"
            impact="200+ kids active"
          />
        </div>
      </div>
    </div>
  );
}
