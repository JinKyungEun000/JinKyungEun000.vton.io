import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import VirtualTryOn from './pages/VirtualTryOn';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  
  const handleStart = () => {
    setShowLanding(false);
    
    // Scroll to top when transitioning
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-white">
      {showLanding ? (
        <LandingPage onStart={handleStart} />
      ) : (
        <VirtualTryOn />
      )}
    </div>
  );
}

export default App;