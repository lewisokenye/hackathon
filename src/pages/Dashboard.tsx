import React from 'react';
import { Heart, Users, Package, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';

function Dashboard() {
  const { user } = useUser();

  const stats = [
    {
      title: 'Total Donations',
      value: '1,247',
      change: '+12%',
      icon: Heart,
      color: 'emerald'
    },
    {
      title: 'People Helped',
      value: '3,892',
      change: '+8%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Food Items',
      value: '562',
      change: '+23%',
      icon: Package,
      color: 'orange'
    },
    {
      title: 'Community Growth',
      value: '89%',
      change: '+4%',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-emerald-100 text-lg mb-4">
              You've made a real difference in your community
            </p>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{user?.points}</div>
                <div className="text-emerald-200 text-sm">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user?.streak}</div>
                <div className="text-emerald-200 text-sm">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user?.badges.length}</div>
                <div className="text-emerald-200 text-sm">Badges</div>
              </div>
            </div>
          </div>
          <Link
            to="/donations"
            className="mt-4 md:mt-0 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Make Donation</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/donations"
                className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Donate Food</span>
                </div>
                <ArrowRight className="h-5 w-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/marketplace"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Browse Items</span>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/rewards"
                className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">View Rewards</span>
                </div>
                <ArrowRight className="h-5 w-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Your Impact</h3>
            <p className="text-purple-100 text-sm mb-4">
              Thanks to donors like you, we've helped feed over 10,000 people this month.
            </p>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Goal</span>
                <span className="text-sm font-semibold">78%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div className="bg-white rounded-full h-2 w-[78%] transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;