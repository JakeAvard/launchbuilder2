import { useState, useEffect } from 'react';
import { DollarSign, Heart, TrendingUp, Calendar, PieChart } from 'lucide-react';
import StatCard from '../components/StatCard';
import TrendChart from '../components/TrendChart';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/roundup';

interface ImpactProps {
  userId?: string;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export default function Impact({ userId }: ImpactProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState({
    totalGiven: 2450.75,
    totalRoundUp: 125.5,
    organizationsSupported: 8,
    totalDonations: 42,
    averageDonation: 58.35,
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([
    { category: 'Education', amount: 850, count: 12, percentage: 35 },
    { category: 'Health', amount: 620, count: 8, percentage: 25 },
    { category: 'Environment', amount: 490, count: 10, percentage: 20 },
    { category: 'Community', amount: 320, count: 7, percentage: 13 },
    { category: 'Animals', amount: 170, count: 5, percentage: 7 },
  ]);
  const [trendData, setTrendData] = useState<Array<{ label: string; amount: number }>>([
    { label: 'Week 1', amount: 450 },
    { label: 'Week 2', amount: 680 },
    { label: 'Week 3', amount: 520 },
    { label: 'Week 4', amount: 800 },
  ]);

  useEffect(() => {
    if (userId) {
      loadImpactData();
    }
  }, [userId, period]);

  const loadImpactData = async () => {
    try {
      const { data: donations } = await supabase
        .from('donations')
        .select('*, organizations(category)')
        .eq('user_id', userId);

      if (donations && donations.length > 0) {
        const total = donations.reduce((sum, d) => sum + Number(d.amount), 0);
        const roundUp = donations.reduce((sum, d) => sum + Number(d.round_up_amount), 0);
        const average = total / donations.length;

        setStats({
          totalGiven: total,
          totalRoundUp: roundUp,
          organizationsSupported: new Set(donations.map(d => d.organization_id)).size,
          totalDonations: donations.length,
          averageDonation: average,
        });
      }
    } catch (error) {
      console.error('Error loading impact data:', error);
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-pink-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Impact</h1>
          <p className="text-gray-600">See the difference you're making</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Given"
            value={formatCurrency(stats.totalGiven)}
            icon={DollarSign}
            trend="+12% from last period"
          />
          <StatCard
            title="Round-Up Contributions"
            value={formatCurrency(stats.totalRoundUp)}
            icon={TrendingUp}
            subtitle="From round-up feature"
          />
          <StatCard
            title="Organizations"
            value={stats.organizationsSupported}
            icon={Heart}
            subtitle="Supported"
          />
          <StatCard
            title="Total Donations"
            value={stats.totalDonations}
            icon={Calendar}
            subtitle={`Avg: ${formatCurrency(stats.averageDonation)}`}
          />
        </div>

        <div className="mb-8">
          <TrendChart data={trendData} period={period} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Impact by Category</h2>
            </div>
            <div className="space-y-4">
              {categoryBreakdown.map((item, index) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-gray-900">{item.category}</span>
                      <span className="text-sm text-gray-500 ml-2">({item.count} donations)</span>
                    </div>
                    <span className="font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${getCategoryColor(index)} transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{item.percentage}% of total giving</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Giving Insights</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Most Supported Cause</h3>
                <p className="text-sm text-gray-600">
                  Education initiatives received 35% of your donations this {period}
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Consistency Champion</h3>
                <p className="text-sm text-gray-600">
                  You've donated for 4 consecutive weeks. Keep up the amazing work!
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Round-Up Impact</h3>
                <p className="text-sm text-gray-600">
                  Your round-ups added {formatCurrency(stats.totalRoundUp)} to your donations automatically
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Growing Generosity</h3>
                <p className="text-sm text-gray-600">
                  Your giving increased 12% compared to last {period}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">You're Making a Real Difference!</h2>
          <p className="text-lg text-green-100 mb-6">
            Your {formatCurrency(stats.totalGiven)} in donations has supported {stats.organizationsSupported} organizations
            and contributed to positive change in your community and beyond.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{stats.totalDonations}</div>
              <div className="text-sm text-green-100">Total Donations</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{stats.organizationsSupported}</div>
              <div className="text-sm text-green-100">Organizations Helped</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{formatCurrency(stats.averageDonation)}</div>
              <div className="text-sm text-green-100">Avg per Donation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
