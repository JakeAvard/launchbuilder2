import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Impact from './pages/Impact';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}