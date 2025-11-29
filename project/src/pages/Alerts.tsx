import { useState, useEffect } from 'react';
import { Bell, Trophy, Calendar, Sparkles, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/roundup';

interface Alert {
  id: string;
  type: 'milestone' | 'goal' | 'recommendation' | 'recurring';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface AlertsProps {
  userId?: string;
}

const SAMPLE_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'milestone',
    title: 'Milestone Reached! 🎉',
    message: 'Congratulations! You\'ve donated over $2,000 this year. Your generosity is making a real impact!',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    type: 'goal',
    title: 'Monthly Goal Progress',
    message: 'You\'re 80% of the way to your $500 monthly giving goal. Just $100 more to reach it!',
    is_read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    type: 'recurring',
    title: 'Recurring Donation Processed',
    message: 'Your monthly donation of $50 to Green Earth Alliance has been successfully processed.',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '4',
    type: 'recommendation',
    title: 'New Organization Recommendation',
    message: 'Based on your giving history, you might be interested in Healthcare Heroes - a local organization focused on medical care.',
    is_read: false,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '5',
    type: 'milestone',
    title: '6-Month Giving Streak! 🔥',
    message: 'Amazing! You\'ve made donations for 6 consecutive months. Keep up the incredible consistency!',
    is_read: true,
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '6',
    type: 'recurring',
    title: 'Upcoming Recurring Donation',
    message: 'Your recurring donation of $75 to Education First Foundation is scheduled for tomorrow.',
    is_read: false,
    created_at: new Date(Date.now() - 345600000).toISOString(),
  },
];

export default function Alerts({ userId }: AlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>(SAMPLE_ALERTS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (userId) {
      loadAlerts();
    }
  }, [userId]);

  const loadAlerts = async () => {
    try {
      const { data } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setAlerts(data as Alert[]);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const markAsRead = async (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, is_read: true } : alert
      )
    );

    if (userId) {
      await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId);
    }
  };

  const deleteAlert = async (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));

    if (userId) {
      await supabase.from('alerts').delete().eq('id', alertId);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Trophy className="text-yellow-500" size={24} />;
      case 'goal':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'recurring':
        return <Calendar className="text-blue-500" size={24} />;
      case 'recommendation':
        return <Sparkles className="text-purple-500" size={24} />;
      default:
        return <Bell className="text-gray-500" size={24} />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredAlerts = filter === 'unread'
    ? alerts.filter(alert => !alert.is_read)
    : alerts;

  const unreadCount = alerts.filter(alert => !alert.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-gray-600">Stay updated on your giving journey</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'unread' ? 'All caught up!' : 'No alerts yet'}
            </h3>
            <p className="text-gray-600">
              {filter === 'unread'
                ? 'You\'ve read all your notifications'
                : 'We\'ll notify you about milestones, goals, and opportunities'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white rounded-xl border ${
                  alert.is_read ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
                } p-6 transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {getTimeAgo(alert.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                    <div className="flex items-center gap-2">
                      {!alert.is_read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1 bg-blue-50 rounded-lg transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-xs font-medium text-gray-600 hover:text-red-600 px-3 py-1 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <X size={14} />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
            <Trophy size={32} className="mb-3" />
            <h3 className="text-lg font-bold mb-2">Achievement Unlocked</h3>
            <p className="text-sm text-yellow-100">
              You're on track to reach your annual goal! Keep up the amazing work.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-6 text-white">
            <Calendar size={32} className="mb-3" />
            <h3 className="text-lg font-bold mb-2">Recurring Impact</h3>
            <p className="text-sm text-green-100">
              You have 3 active recurring donations totaling $175/month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
