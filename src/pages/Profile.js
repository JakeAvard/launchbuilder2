import React, { useState } from 'react';

export default function Profile() {
  const [goal, setGoal] = useState('1000');
  const [recurringAmount, setRecurringAmount] = useState('150');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile & Settings</h1>
      </div>

      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-avatar">JD</div>
          <div className="profile-info">
            <h2>Jane Donor</h2>
            <p>jane.donor@example.com</p>
            <button className="btn-secondary">Edit Profile</button>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Giving Goals</h2>
        <div className="settings-form">
          <div className="form-group">
            <label>Monthly Giving Goal</label>
            <div className="input-with-prefix">
              <span>$</span>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
            <small>Set a monthly goal to track your giving progress</small>
          </div>

          <div className="form-group">
            <label>Annual Goal</label>
            <div className="input-with-prefix">
              <span>$</span>
              <input
                type="number"
                value={goal * 12}
                readOnly
              />
            </div>
            <small>Based on your monthly goal</small>
          </div>

          <button className="btn-primary">Save Goals</button>
        </div>
      </div>

      <div className="section">
        <h2>Payment Methods</h2>
        <div className="payment-methods">
          <div className="payment-card">
            <div className="card-icon">💳</div>
            <div className="card-details">
              <div className="card-name">Visa ending in 4242</div>
              <div className="card-expiry">Expires 12/25</div>
            </div>
            <button className="btn-text">Edit</button>
          </div>
          <button className="btn-secondary">Add Payment Method</button>
        </div>
      </div>

      <div className="section">
        <h2>Recurring Donations</h2>
        <div className="recurring-list">
          <div className="recurring-item">
            <div className="recurring-info">
              <div className="recurring-org">Clean Water Initiative</div>
              <div className="recurring-amount">$50/month</div>
            </div>
            <div className="recurring-actions">
              <button className="btn-text">Edit</button>
              <button className="btn-text-danger">Cancel</button>
            </div>
          </div>
          <div className="recurring-item">
            <div className="recurring-info">
              <div className="recurring-org">Education For All</div>
              <div className="recurring-amount">$100/month</div>
            </div>
            <div className="recurring-actions">
              <button className="btn-text">Edit</button>
              <button className="btn-text-danger">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Account Settings</h2>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Email Notifications</div>
              <div className="setting-desc">Receive updates about your donations</div>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Monthly Summary</div>
              <div className="setting-desc">Get a monthly impact report</div>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Organization Recommendations</div>
              <div className="setting-desc">Discover new organizations to support</div>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="section">
        <button className="btn-danger">Sign Out</button>
      </div>
    </div>
  );
}
