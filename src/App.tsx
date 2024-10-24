import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Sword, Users, Swords } from 'lucide-react';
import TeamBuilder from './pages/TeamBuilder';
import DraftPractice from './pages/DraftPractice';
import DraftVS from './pages/DraftVS';
import DraftHome from './pages/DraftHome';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <Sword size={24} />
                <span className="font-bold text-lg">LoL Tools</span>
              </Link>
              
              <div className="flex gap-6">
                <Link 
                  to="/team-builder" 
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Users size={20} />
                  <span>Team Builder</span>
                </Link>
                <Link 
                  to="/draft-practice" 
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Sword size={20} />
                  <span>Draft Practice</span>
                </Link>
                <Link 
                  to="/draft" 
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Swords size={20} />
                  <span>Draft VS</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/team-builder" element={<TeamBuilder />} />
        <Route path="/draft-practice" element={<DraftPractice />} />
        <Route path="/draft" element={<DraftHome />} />
        <Route path="/draft/:roomId/:viewType" element={<DraftVS />} />
      </Routes>
    </div>
  );
}

export default App;