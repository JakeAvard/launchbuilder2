import { useState, useEffect } from 'react';
import { User, Target, Settings, DollarSign, Zap, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, calculateRoundUp } from '../lib/roundup';

interface ProfileProps {
  userId?: string;
}

export default function Profile({ userId }: ProfileProps) {
  const [profile, setProfile] = useState({
    display_name: 'Demo User',
    email: 'demo@example.com',
    location: 'San Francisco, CA',
    monthly_goal: 500,
    annual_goal: 6000,
  });

  const [roundUpSettings, setRoundUpSettings] = useState({
    enabled: true,
    round_to: 1.0,
    multiplier: 1.0,
    auto_donate: false,
    accumulation_threshold: 10.0,
  });

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userId) {
      loadProfile();
      loadRoundUpSettings();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadRoundUpSettings = async () => {
    try {
      const { data } = await supabase
        .from('round_up_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        setRoundUpSettings({
          enabled: data.enabled,
          round_to: Number(data.round_to),
          multiplier: 1.0,
          auto_donate: data.auto_donate,
          accumulation_threshold: Number(data.accumulation_threshold),
        });
      }
    } catch (error) {
      console.error('Error loading round-up settings:', error);
    }
  };

  const saveProfile = async () => {
    if (!userId) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setEditing(false);
      return;
    }

    try {
      await supabase
        .from('user_profiles')
        .update({
          display_name: profile.display_name,
          location: profile.location,
          monthly_goal: profile.monthly_goal,
          annual_goal: profile.annual_goal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      await supabase
        .from('round_up_settings')
        .upsert({
          user_id: userId,
          enabled: roundUpSettings.enabled,
          round_to: roundUpSettings.round_to,
          auto_donate: roundUpSettings.auto_donate,
          accumulation_threshold: roundUpSettings.accumulation_threshold,
          updated_at: new Date().toISOString(),
        });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const exampleRoundUp = calculateRoundUp(23.5, {
    enabled: roundUpSettings.enabled,
    round_to: roundUpSettings.round_to,
    multiplier: roundUpSettings.multiplier,
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
          <p className="text-gray-600">Manage your giving goals and preferences</p>
        </div>

        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <Save size={20} />
            <span className="font-medium">Settings saved successfully!</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User size={24} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.display_name}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <Target size={24} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Giving Goals</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Goal
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={profile.monthly_goal}
                    onChange={(e) => setProfile({ ...profile, monthly_goal: Number(e.target.value) })}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Goal
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={profile.annual_goal}
                    onChange={(e) => setProfile({ ...profile, annual_goal: Number(e.target.value) })}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Current Progress:</strong> You're at 49% of your monthly goal and 41% of your annual goal. Keep going!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-full">
                <Zap size={24} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Round-Up Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Enable Round-Up</h3>
                  <p className="text-sm text-gray-600">Automatically round up your donations</p>
                </div>
                <button
                  onClick={() =>
                    setRoundUpSettings({ ...roundUpSettings, enabled: !roundUpSettings.enabled })
                  }
                  disabled={!editing}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    roundUpSettings.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  } ${!editing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      roundUpSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Round To Nearest
                </label>
                <select
                  value={roundUpSettings.round_to}
                  onChange={(e) =>
                    setRoundUpSettings({ ...roundUpSettings, round_to: Number(e.target.value) })
                  }
                  disabled={!editing || !roundUpSettings.enabled}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value={1}>$1.00</option>
                  <option value={5}>$5.00</option>
                  <option value={10}>$10.00</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Auto-Donate Round-Ups</h3>
                  <p className="text-sm text-gray-600">Automatically donate accumulated round-ups</p>
                </div>
                <button
                  onClick={() =>
                    setRoundUpSettings({ ...roundUpSettings, auto_donate: !roundUpSettings.auto_donate })
                  }
                  disabled={!editing || !roundUpSettings.enabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    roundUpSettings.auto_donate ? 'bg-blue-600' : 'bg-gray-300'
                  } ${!editing || !roundUpSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      roundUpSettings.auto_donate ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {roundUpSettings.enabled && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Example</h4>
                  <p className="text-sm text-gray-700">
                    A donation of {formatCurrency(23.5)} would become{' '}
                    <strong>{formatCurrency(exampleRoundUp.finalAmount)}</strong>
                    {' '}(+{formatCurrency(exampleRoundUp.roundUpAmount)} round-up)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gray-100 rounded-full">
                <Settings size={24} className="text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
                <p className="text-sm text-gray-600">Manage email and push notifications</p>
              </button>

              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-900">Payment Methods</h3>
                <p className="text-sm text-gray-600">Add or update payment methods</p>
              </button>

              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
                <p className="text-sm text-gray-600">Control your data and security settings</p>
              </button>
            </div>
          </div>

          {editing && (
            <button
              onClick={saveProfile}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
