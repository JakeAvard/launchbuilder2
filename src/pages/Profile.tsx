import { useState, useEffect } from "react";
import { User, Target, Settings, DollarSign, Zap, Save } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { formatCurrency, calculateRoundUp } from "../lib/roundup";

// --- Initialize Supabase ---
const supabase = createClient(
  "https://iqeaysusoxnjvdipxsme.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZWF5c3Vzb3huanZkaXB4c21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDQ4MDksImV4cCI6MjA3NzQyMDgwOX0.TJuEkX7IWVK3eed7BcRWpOV60CVtEvZMbCR641udbqM"
);

export default function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    organization: "",
    location: "",
    monthly_goal: 0,
    annual_goal: 0,
  });

  const [roundUpSettings, setRoundUpSettings] = useState({
    enabled: false,
    round_to: 1,
    auto_donate: false,
    accumulation_threshold: 10,
  });

  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // --- Load current user from Supabase Auth and sync profile ---
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);

      // --- Upsert profile row for auth user ---
      await supabase.from("user_profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: profile.full_name || "",
        organization: profile.organization || "",
        location: profile.location || "",
      });

      // --- Load profile data ---
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) setProfile(profileData);

      // --- Load round-up settings ---
      const { data: roundData } = await supabase
        .from("round_up_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roundData)
        setRoundUpSettings({
          enabled: roundData.enabled,
          round_to: Number(roundData.round_to),
          auto_donate: roundData.auto_donate,
          accumulation_threshold: Number(roundData.accumulation_threshold),
        });
    };

    fetchUserAndProfile();
  }, []);

  // --- Save profile changes ---
  const saveProfile = async () => {
    if (!user) return;

    try {
      await supabase
        .from("user_profiles")
        .update({
          full_name: profile.full_name,
          organization: profile.organization,
          location: profile.location,
          monthly_goal: profile.monthly_goal,
          annual_goal: profile.annual_goal,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      await supabase
        .from("round_up_settings")
        .upsert({
          user_id: user.id,
          enabled: roundUpSettings.enabled,
          round_to: roundUpSettings.round_to,
          auto_donate: roundUpSettings.auto_donate,
          accumulation_threshold: roundUpSettings.accumulation_threshold,
          updated_at: new Date().toISOString(),
        });

      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const exampleRoundUp = calculateRoundUp(23.5, {
    enabled: roundUpSettings.enabled,
    round_to: roundUpSettings.round_to,
    multiplier: 1.0,
  });

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600">
            Manage your giving goals and preferences
          </p>
        </div>

        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <Save size={20} />
            <span className="font-medium">Settings saved successfully!</span>
          </div>
        )}

        {/* Profile Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User size={24} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Profile Information
                </h2>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </span>
                <input
                  type="text"
                  value={profile.full_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </span>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Organization
                </span>
                <input
                  type="text"
                  value={profile.organization || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, organization: e.target.value })
                  }
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </span>
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>
            </div>
          </div>

          {/* Giving Goals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <Target size={24} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Giving Goals</h2>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Goal
                </span>
                <input
                  type="number"
                  value={profile.monthly_goal || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      monthly_goal: Number(e.target.value),
                    })
                  }
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Goal
                </span>
                <input
                  type="number"
                  value={profile.annual_goal || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      annual_goal: Number(e.target.value),
                    })
                  }
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>
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

