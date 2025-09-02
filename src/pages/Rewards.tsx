import React from 'react';
import { Trophy, Star, Flame, Target, Award, TrendingUp } from 'lucide-react';
import { useUser } from '../context/UserContext';
import RewardsCard from '../components/RewardsCard';
import Leaderboard from '../components/Leaderboard';

function Rewards() {
  const { user } = useUser();

  const badges = [
    {
      name: 'Bronze Donor',
      description: 'Made your first 10 donations',
      icon: Award,
      color: 'orange',
      earned: true,
      earnedDate: '2025-01-05'
    },
    {
      name: 'Community Helper',
      description: 'Helped 50 people through donations',
      icon: Star,
      color: 'blue',
      earned: true,
      earnedDate: '2025-01-08'
    },
    {
      name: 'Food Warrior',
      description: 'Donated 100 food items',
      icon: Trophy,
      color: 'emerald',
      earned: true,
      earnedDate: '2025-01-10'
    },
    {
      name: 'Silver Donor',
      description: 'Reach 500 total points',
      icon: Award,
      color: 'gray',
      earned: false,
      progress: 90
    },
    {
      name: 'Streak Master',
      description: 'Maintain a 30-day donation streak',
      icon: Flame,
      color: 'red',
      earned: false,
      progress: 23
    },
    {
      name: 'Gold Donor',
      description: 'Reach 1000 total points',
      icon: Trophy,
      color: 'yellow',
      earned: false,
      progress: 45
    }
  ];

  const nextMilestone = badges.find(badge => !badge.earned);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Your <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Rewards</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your impact and unlock achievements as you help your community.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <RewardsCard
          title="Total Points"
          value={user?.points?.toString() || '0'}
          icon={Star}
          color="emerald"
          subtitle="Earned from donations"
        />
        <RewardsCard
          title="Current Streak"
          value={`${user?.streak || 0} days`}
          icon={Flame}
          color="orange"
          subtitle="Consecutive donation days"
        />
        <RewardsCard
          title="Badges Earned"
          value={user?.badges?.length?.toString() || '0'}
          icon={Trophy}
          color="purple"
          subtitle="Achievement unlocked"
        />
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Next Milestone</h3>
              <p className="text-blue-100 mb-2">{nextMilestone.name} - {nextMilestone.description}</p>
              {nextMilestone.progress && (
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${nextMilestone.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
            {nextMilestone.progress && (
              <div className="text-right">
                <div className="text-xl font-bold">{nextMilestone.progress}%</div>
                <div className="text-blue-200 text-sm">Complete</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badges Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievement Badges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    badge.earned
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      badge.earned
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-300 text-gray-500'
                    }`}>
                      <badge.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        badge.earned ? 'text-emerald-700' : 'text-gray-600'
                      }`}>
                        {badge.name}
                      </h3>
                      {badge.earned && badge.earnedDate && (
                        <p className="text-xs text-emerald-600">
                          Earned {new Date(badge.earnedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                  
                  {!badge.earned && badge.progress && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 rounded-full h-2 transition-all duration-500"
                          style={{ width: `${badge.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

export default Rewards;