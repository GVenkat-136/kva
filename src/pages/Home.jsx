import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import Card from '../components/Card.jsx';
import { 
  BuildingStorefrontIcon, 
  HomeModernIcon, 
  CubeIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  ArchiveBoxIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Get current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const cards = [
    { 
      to: '/godowns', 
      title: 'Godowns', 
      icon: <HomeModernIcon className="w-7 h-7" />,
      description: 'Manage and track all your warehouse locations, capacity, and storage units',
      count: 12
    },
    { 
      to: '/stores', 
      title: 'Stores', 
      icon: <BuildingStorefrontIcon className="w-7 h-7" />,
      description: 'Monitor your retail stores, inventory distribution, and store operations',
      count: 8
    },
    { 
      to: '/stocks', 
      title: 'Stocks', 
      icon: <CubeIcon className="w-7 h-7" />,
      description: 'Track stock levels, movements, and inventory across all locations',
      count: 156
    },
    { 
      to: '/reports', 
      title: 'Reports', 
      icon: <ChartBarIcon className="w-7 h-7" />,
      description: 'Generate comprehensive analytics and insights for better decision making',
      count: 24,
      hidden: !isAdmin 
    },
  ];

  return (
    <div className="h-full overflow-hidden p-6">
      <div className="max-w-7xl mx-auto space-y-4 h-full flex flex-col">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal to-teal/90 rounded-2xl py-2 px-4 text-white">
          <div className="flex items-center justify-between">
    <div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-white/80 text-sm">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 min-w-[120px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium text-white/70 uppercase">Status</span>
                </div>
                <p className="font-bold">Operational</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 min-w-[120px]">
                <div className="text-xs font-medium text-white/70 uppercase mb-1">Active</div>
                <p className="font-bold">1 User Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Stores */}
          <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 border border-blue-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 to-blue-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <BuildingStorefrontIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-black text-gray-900 mb-0.5">8</h3>
                <p className="text-gray-600 text-xs font-semibold">Total Stores</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Godowns */}
          <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 border border-purple-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/0 to-purple-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-purple-200/30 blur-2xl"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <HomeModernIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-black text-gray-900 mb-0.5">12</h3>
                <p className="text-gray-600 text-xs font-semibold">Total Godowns</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <BuildingOfficeIcon className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Stocks */}
          <div className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 border border-green-200">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/0 to-green-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-200/30 blur-2xl"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <CubeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-black text-gray-900 mb-0.5">156</h3>
                <p className="text-gray-600 text-xs font-semibold">Stock Items</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArchiveBoxIcon className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          {/* Reports */}
          {isAdmin && (
            <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 border border-orange-200">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/0 to-orange-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-orange-200/30 blur-2xl"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <ChartBarIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-black text-gray-900 mb-0.5">24</h3>
                  <p className="text-gray-600 text-xs font-semibold">Reports</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <DocumentChartBarIcon className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions and Chart Section - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Quick Actions Section */}
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h2 className="text-2xl font-black text-gray-900 mb-1">Quick Actions</h2>
              <p className="text-gray-600 text-sm">
                Access all your inventory management tools
              </p>
      </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {cards.map((c) => (
          <Card key={c.title} {...c} />
        ))}
            </div>
          </div>

          {/* External Store Due Amount Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 flex flex-col h-full">
            <div className="mb-4">
              <h2 className="text-2xl font-black text-gray-900 mb-1">External Store Due Amount</h2>
              <p className="text-gray-600 text-sm">Overview of pending payments from external stores</p>
            </div>
            
            <div className="flex flex-col flex-1 min-h-0">
              {/* Vertical Bar Chart */}
              <div className="flex items-end justify-between gap-3 flex-1 pb-6 border-b-2 border-gray-200">
                {/* Store Alpha */}
                <div className="flex-1 flex flex-col items-center h-full justify-end">
                  <div className="text-xs font-bold text-red-600 mb-2">₹45K</div>
                  <div 
                    className="w-full rounded-t-lg hover:opacity-90 transition-all duration-300 cursor-pointer relative group"
                    style={{
                      height: '75%',
                      background: 'linear-gradient(to top, #ef4444, #f87171)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                  </div>
                  <div className="text-xs font-semibold text-gray-700 mt-3 text-center">Alpha</div>
                </div>

                {/* Store Beta */}
                <div className="flex-1 flex flex-col items-center h-full justify-end">
                  <div className="text-xs font-bold text-orange-600 mb-2">₹32.5K</div>
                  <div 
                    className="w-full rounded-t-lg hover:opacity-90 transition-all duration-300 cursor-pointer relative group"
                    style={{
                      height: '54%',
                      background: 'linear-gradient(to top, #f97316, #fb923c)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                  </div>
                  <div className="text-xs font-semibold text-gray-700 mt-3 text-center">Beta</div>
                </div>

                {/* Store Gamma */}
                <div className="flex-1 flex flex-col items-center h-full justify-end">
                  <div className="text-xs font-bold text-yellow-600 mb-2">₹28.7K</div>
                  <div 
                    className="w-full rounded-t-lg hover:opacity-90 transition-all duration-300 cursor-pointer relative group"
                    style={{
                      height: '48%',
                      background: 'linear-gradient(to top, #eab308, #facc15)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                  </div>
                  <div className="text-xs font-semibold text-gray-700 mt-3 text-center">Gamma</div>
                </div>

                {/* Store Delta */}
                <div className="flex-1 flex flex-col items-center h-full justify-end">
                  <div className="text-xs font-bold text-green-600 mb-2">₹15K</div>
                  <div 
                    className="w-full rounded-t-lg hover:opacity-90 transition-all duration-300 cursor-pointer relative group"
                    style={{
                      height: '25%',
                      background: 'linear-gradient(to top, #22c55e, #4ade80)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                  </div>
                  <div className="text-xs font-semibold text-gray-700 mt-3 text-center">Delta</div>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4">
                <div className="flex items-center justify-between bg-teal/5 rounded-xl p-3 border-2 border-teal/20">
                  <span className="text-sm font-black text-gray-900">Total Due Amount</span>
                  <span className="text-2xl font-black text-teal">₹1.21L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


