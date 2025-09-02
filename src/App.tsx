import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import Marketplace from './pages/Marketplace';
import Rewards from './pages/Rewards';
import MapView from './pages/MapView';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
          <Navbar />
          <main className="pb-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/map" element={<MapView />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;