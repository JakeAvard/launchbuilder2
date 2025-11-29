import { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import OrgCard from '../components/OrgCard';
import { supabase } from '../lib/supabase';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🌟' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'environment', name: 'Environment', icon: '🌱' },
  { id: 'hunger', name: 'Hunger Relief', icon: '🍽️' },
  { id: 'animals', name: 'Animals', icon: '🐾' },
  { id: 'arts', name: 'Arts & Culture', icon: '🎨' },
  { id: 'community', name: 'Community', icon: '🏘️' },
  { id: 'human-rights', name: 'Human Rights', icon: '✊' },
  { id: 'disaster', name: 'Disaster Relief', icon: '🆘' },
  { id: 'children', name: 'Children', icon: '👶' },
];

const SAMPLE_ORGANIZATIONS = [
  {
    id: '1',
    name: 'Green Earth Alliance',
    category: 'environment',
    description: 'Protecting our planet through conservation, renewable energy, and sustainable practices for future generations.',
    logo_url: null,
    location: 'San Francisco, CA',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Education First Foundation',
    category: 'education',
    description: 'Providing quality education and learning resources to underserved communities worldwide.',
    logo_url: null,
    location: 'New York, NY',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Healthcare Heroes',
    category: 'health',
    description: 'Delivering essential medical care and health services to communities in need.',
    logo_url: null,
    location: 'Chicago, IL',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Feed The Future',
    category: 'hunger',
    description: 'Fighting hunger and food insecurity through community food programs and sustainable agriculture.',
    logo_url: null,
    location: 'Austin, TX',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Wildlife Protection Network',
    category: 'animals',
    description: 'Rescuing, rehabilitating, and protecting endangered wildlife and their natural habitats.',
    logo_url: null,
    location: 'Denver, CO',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Arts For All',
    category: 'arts',
    description: 'Making arts and cultural experiences accessible to everyone regardless of background or income.',
    logo_url: null,
    location: 'Seattle, WA',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Community Builders United',
    category: 'community',
    description: 'Strengthening neighborhoods through local programs, events, and community development initiatives.',
    logo_url: null,
    location: 'Portland, OR',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Equal Rights Advocates',
    category: 'human-rights',
    description: 'Fighting for justice, equality, and human rights for all people around the world.',
    logo_url: null,
    location: 'Washington, DC',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Rapid Response Relief',
    category: 'disaster',
    description: 'Providing immediate disaster relief and long-term recovery support to affected communities.',
    logo_url: null,
    location: 'Miami, FL',
    verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Children First Foundation',
    category: 'children',
    description: 'Supporting children\'s welfare, education, and development programs for a brighter future.',
    logo_url: null,
    location: 'Boston, MA',
    verified: true,
    created_at: new Date().toISOString(),
  },
];

export default function Discover() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [organizations, setOrganizations] = useState(SAMPLE_ORGANIZATIONS);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);

  useEffect(() => {
    loadOrganizations();
  }, [selectedCategory]);

  const loadOrganizations = async () => {
    try {
      let query = supabase.from('organizations').select('*');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (data && data.length > 0) {
        setOrganizations(data);
      } else {
        const filtered =
          selectedCategory === 'all'
            ? SAMPLE_ORGANIZATIONS
            : SAMPLE_ORGANIZATIONS.filter((org) => org.category === selectedCategory);
        setOrganizations(filtered);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const filteredOrganizations = organizations.filter((org) =>
    searchQuery
      ? org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const getAIRecommendations = () => {
    return SAMPLE_ORGANIZATIONS.slice(0, 3);
  };

  useEffect(() => {
    setAiRecommendations(getAIRecommendations());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Organizations</h1>
          <p className="text-gray-600">Find causes that matter to you</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={24} />
            <h2 className="text-xl font-bold">AI-Optimized Recommendations</h2>
          </div>
          <p className="text-purple-100 mb-4">
            Based on your giving history and interests, we recommend these organizations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecommendations.map((org) => (
              <div key={org.id} className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h3 className="font-semibold mb-1">{org.name}</h3>
                <p className="text-sm text-purple-100 line-clamp-2">{org.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {filteredOrganizations.length} Organizations Found
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <OrgCard key={org.id} organization={org} onSelect={() => {}} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
