import React from 'react';
import AlertCard from '../components/AlertCard';

export default function Alerts() {
  const milestones = [
    { title: 'Goal Achieved!', message: 'You reached your $1,000 monthly giving goal', date: '2 days ago', type: 'success' },
    { title: '50% Milestone', message: 'Halfway to your annual goal of $10,000', date: '1 week ago', type: 'progress' }
  ];

  const recurringUpdates = [
    { title: 'Monthly Donation Processed', message: '$150 donated to Clean Water Initiative', date: 'Today', type: 'info' },
    { title: 'Upcoming Donation', message: '$50 will be donated to Education For All in 5 days', date: 'Scheduled', type: 'upcoming' },
    { title: 'Receipt Available', message: 'Your tax receipt for Q4 is ready', date: '3 days ago', type: 'info' }
  ];

  const newOrgs = [
    { title: 'New Match Near You', message: 'Youth Arts Program matches your interests and is 0.3 mi away', date: '1 day ago', type: 'discover' },
    { title: 'Recommended Organization', message: 'Climate Action Fund aligns with your giving history', date: '2 days ago', type: 'discover' },
    { title: 'Trending Organization', message: 'Disaster Relief Network is trending in your area', date: '4 days ago', type: 'discover' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Alerts & Updates</h1>
      </div>

      <div className="section">
        <h2>Milestones</h2>
        {milestones.length > 0 ? (
          <div className="alerts-list">
            {milestones.map((alert, idx) => (
              <AlertCard key={idx} {...alert} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Set giving goals in your profile to track milestones!</p>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Recurring Giving Updates</h2>
        <div className="alerts-list">
          {recurringUpdates.map((alert, idx) => (
            <AlertCard key={idx} {...alert} />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Discover New Organizations</h2>
        <div className="alerts-list">
          {newOrgs.map((alert, idx) => (
            <AlertCard key={idx} {...alert} />
          ))}
        </div>
      </div>
    </div>
  );
}
