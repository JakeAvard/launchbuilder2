import { useState, useEffect } from 'react';
import { DollarSign, Heart, TrendingUp, Calendar } from 'lucide-react';
import StatCard from '../components/StatCard';
import TrendChart from '../components/TrendChart';
import OrgCard from '../components/OrgCard';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/roundup';

interface HomeProps {
  userId?: string;
}

export default function Home({ userId }: HomeProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState({
    totalGiven: 0,
    organizationsSupported: 0,
    recurringImpact: 0,
  });
  const [trendData, setTrendData] = useState<Array<{ label: string; amount: number }>>([]);
  const [topOrganizations, setTopOrganizations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      loadDashboardData();
    } else {
      loadSampleData();
    }
  }, [userId, period]);

  const loadSampleData = () => {
    setStats({
      totalGiven: 2450.75,
      organizationsSupported: 8,
      recurringImpact: 125.0,
    });

    const monthData = [
      { label: 'Week 1', amount: 450 },
      { label: 'Week 2', amount: 680 },
      { label: 'Week 3', amount: 520 },
      { label: 'Week 4', amount: 800 },
    ];

    const yearData = [
      { label: 'Jan', amount: 1200 },
      { label: 'Feb', amount: 1500 },
      { label: 'Mar', amount: 1800 },
      { label: 'Apr', amount: 2100 },
      { label: 'May', amount: 1900 },
      { label: 'Jun', amount: 2450 },
      { label: 'Jul', amount: 2200 },
      { label: 'Aug', amount: 2600 },
      { label: 'Sep', amount: 2300 },
      { label: 'Oct', amount: 2800 },
      { label: 'Nov', amount: 0 },
      { label: 'Dec', amount: 0 },
    ];

    setTrendData(period === 'year' ? yearData : monthData);
  };

  const loadDashboardData = async () => {
    try {
      const { data: donations } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', userId);

      const { data: userOrgs } = await supabase
        .from('user_organizations')
        .select('*, organizations(*)')
        .eq('user_id', userId)
        .order('total_donated', { ascending: false })
        .limit(3);

      if (donations) {
        const total = donations.reduce((sum, d) => sum + Number(d.amount), 0);
        const recurring = donations
          .filter(d => d.is_recurring)
          .reduce((sum, d) => sum + Number(d.amount), 0);

        setStats({
          totalGiven: total,
          organizationsSupported: userOrgs?.length || 0,
          recurringImpact: recurring,
        });
      }

      if (userOrgs) {
        setTopOrganizations(userOrgs);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      loadSampleData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Impact Dashboard</h1>
          <p className="text-gray-600">Track your giving journey and make a difference</p>
        </div>

        <div className="flex gap-2 mb-6">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Given"
            value={formatCurrency(stats.totalGiven)}
            icon={DollarSign}
            trend="+12% from last month"
          />
          <StatCard
            title="Organizations Supported"
            value={stats.organizationsSupported}
            icon={Heart}
            subtitle="Making a difference"
          />
          <StatCard
            title="Recurring Monthly Impact"
            value={formatCurrency(stats.recurringImpact)}
            icon={Calendar}
            subtitle="Automatic giving"
          />
        </div>

        <div className="mb-8">
          <TrendChart data={trendData} period={period} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topOrganizations.length > 0 ? (
              topOrganizations.map((userOrg) => (
                <OrgCard
                  key={userOrg.id}
                  organization={userOrg.organizations}
                  totalDonated={userOrg.total_donated}
                  isFavorite={userOrg.is_favorite}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
                <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Start supporting organizations to see them here</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Discover active campaigns in the Discover section</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Discover Organizations Near You</h2>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-xl font-semibold mb-2">Explore Local Impact</h3>
            <p className="mb-4 text-blue-100">Find organizations making a difference in your community</p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Browse Nearby Organizations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
