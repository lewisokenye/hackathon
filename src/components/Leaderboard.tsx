import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Star } from 'lucide-react';
import axios from 'axios';

interface LeaderboardEntry {
  user_id: number;
  name: string;
  points: number;
  streak: number;
  badges: string[];
}

function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/rewards/leaderboard/top?limit=10');
      setLeaders(response.data.data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // Mock data for demo
      setLeaders([
        { user_id: 1, name: 'Alex Johnson', points: 450, streak: 7, badges: ['Bronze Donor', 'Community Helper'] },
        { user_id: 2, name: 'Sarah Chen', points: 380, streak: 12, badges: ['Bronze Donor'] },
        { user_id: 3, name: 'Mike Rodriguez', points: 325, streak: 3, badges: ['Bronze Donor', 'Food Warrior'] },
        { user_id: 4, name: 'Emma Thompson', points: 290, streak: 15, badges: ['Community Helper'] },
        { user_id: 5, name: 'David Park', points: 275, streak: 5, badges: ['Bronze Donor'] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Medal className="h-5 w-5 text-orange-600" />;
      default: return <Trophy className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 1: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
      case 2: return 'bg-gradient-to-r from-orange-400 to-red-500 text-white';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Leaderboard</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Community Leaderboard</h3>
      </div>

      <div className="space-y-3">
        {leaders.map((leader, index) => (
          <div
            key={leader.user_id}
            className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 ${
              index < 3 ? 'bg-gradient-to-r ' + getRankColor(index) : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index < 3 ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
              }`}>
                {index < 3 ? getRankIcon(index) : `#${index + 1}`}
              </div>
              <div>
                <p className={`font-semibold ${index < 3 ? 'text-white' : 'text-gray-900'}`}>
                  {leader.name}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={index < 3 ? 'text-white/80' : 'text-gray-500'}>
                    {leader.streak} day streak
                  </span>
                  {leader.badges && leader.badges.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className={`h-3 w-3 ${index < 3 ? 'text-white/80' : 'text-yellow-500'}`} />
                      <span className={`text-xs ${index < 3 ? 'text-white/80' : 'text-gray-500'}`}>
                        {leader.badges.length} badges
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className={`text-lg font-bold ${index < 3 ? 'text-white' : 'text-gray-900'}`}>
                {leader.points.toLocaleString()}
              </div>
              <div className={`text-xs ${index < 3 ? 'text-white/80' : 'text-gray-500'}`}>
                points
              </div>
            </div>
          </div>
        ))}
      </div>

      {leaders.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No leaderboard data available yet.</p>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;