import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Impact from "./pages/Impact";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import "./style.css";

const supabaseUrl = "https://iqeaysusoxnjvdipxsme.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZWF5c3Vzb3huanZkaXB4c21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDQ4MDksImV4cCI6MjA3NzQyMDgwOX0.TJuEkX7IWVK3eed7BcRWpOV60CVtEvZMbCR641udbqM";
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Header with Sign Out ---
const Header = ({ user }: { user: any }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm flex justify-between items-center px-6 py-4">
      <h1 className="text-xl font-bold">Tither</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error.message);
      setUser(null);
      setLoading(false);
      return;
    }

    if (!session) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  useEffect(() => {
    checkSession();

    // --- Auto refresh session ---
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) setUser(null);
      else setUser(session.user);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Router>
      <Header user={user} />
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/discover" element={<Discover user={user} />} />
          <Route path="/impact" element={<Impact user={user} />} />
          <Route path="/alerts" element={<Alerts user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          {/* Redirect to login if no session */}
          {!user && <Route path="*" element={<LoginRedirect />} />}
        </Routes>
      </main>
    </Router>
  );
}

// --- Helper for redirecting to login ---
const LoginRedirect = () => {
  useEffect(() => {
    window.location.href = "/app/login.html";
  }, []);
  return <div className="min-h-screen flex items-center justify-center text-gray-500">Redirecting to login...</div>;
};
