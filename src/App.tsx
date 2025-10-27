import { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Impact from './pages/Impact';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const userId = undefined;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home userId={userId} />;
      case 'discover':
        return <Discover />;
      case 'impact':
        return <Impact userId={userId} />;
      case 'alerts':
        return <Alerts userId={userId} />;
      case 'profile':
        return <Profile userId={userId} />;
      default:
        return <Home userId={userId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
