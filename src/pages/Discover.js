import React, { useState } from 'react';
import OrgCard from '../components/OrgCard';

const categories = [
  'All',
  'Environment',
  'Education',
  'Hunger Relief',
  'Healthcare',
  'Animal Welfare',
  'Community',
  'Youth Development',
  'Arts & Culture',
  'Human Rights'
];

const sampleOrgs = [
  { name: 'Global Climate Action', category: 'Environment', rating: 4.8, impact: '50M trees planted', mission: 'Fighting climate change through reforestation' },
  { name: 'Literacy Project International', category: 'Education', rating: 4.9, impact: '100K students taught', mission: 'Bringing education to underserved communities' },
  { name: 'Meals on Wheels Plus', category: 'Hunger Relief', rating: 4.7, impact: '1M meals delivered', mission: 'Ending hunger for seniors and families' },
  { name: 'Free Health Clinic Network', category: 'Healthcare', rating: 4.6, impact: '500K patients treated', mission: 'Providing free medical care to those in need' },
  { name: 'Animal Rescue Alliance', category: 'Animal Welfare', rating: 4.8, impact: '10K animals saved', mission: 'Rescuing and rehoming abandoned animals' },
  { name: 'Neighborhood United', category: 'Community', rating: 4.5, impact: '200 community events', mission: 'Building stronger, connected neighborhoods' },
  { name: 'Youth Mentorship Program', category: 'Youth Development', rating: 4.9, impact: '5K youth mentored', mission: 'Empowering the next generation through mentorship' },
  { name: 'Arts Access Foundation', category: 'Arts & Culture', rating: 4.7, impact: '50K free tickets', mission: 'Making arts accessible to everyone' },
  { name: 'Human Rights Watch Global', category: 'Human Rights', rating: 4.8, impact: '30 countries served', mission: 'Defending human rights worldwide' },
  { name: 'Ocean Conservation Society', category: 'Environment', rating: 4.6, impact: '100 beaches cleaned', mission: 'Protecting marine ecosystems' }
];

export default function Discover() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAIRec, setShowAIRec] = useState(true);

  const filteredOrgs = selectedCategory === 'All'
    ? sampleOrgs
    : sampleOrgs.filter(org => org.category === selectedCategory);

  const aiRecommended = sampleOrgs.slice(0, 3);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Discover Organizations</h1>
      </div>

      {showAIRec && (
        <div className="ai-recommendations">
          <div className="ai-header">
            <h2>AI-Optimized Recommendations</h2>
            <span className="ai-badge">Personalized For You</span>
          </div>
          <div className="cards-grid">
            {aiRecommended.map((org, idx) => (
              <OrgCard
                key={idx}
                name={org.name}
                category={org.category}
                rating={org.rating}
                impact={org.impact}
                mission={org.mission}
                recommended={true}
              />
            ))}
          </div>
        </div>
      )}

      <div className="category-filter">
        <h3>Browse by Category</h3>
        <div className="category-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>{selectedCategory === 'All' ? 'All Organizations' : selectedCategory}</h2>
        <div className="cards-grid">
          {filteredOrgs.map((org, idx) => (
            <OrgCard
              key={idx}
              name={org.name}
              category={org.category}
              rating={org.rating}
              impact={org.impact}
              mission={org.mission}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
