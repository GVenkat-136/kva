import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { 
  HomeIcon,
  BuildingStorefrontIcon, 
  HomeModernIcon, 
  CubeIcon, 
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAdmin = user?.role === 'admin';

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const isManager = user?.role === 'manager';

  const navigationItems = [
    { 
      to: '/', 
      label: 'Home', 
      icon: HomeIcon,
      summary: 'Dashboard overview',
      exact: true,
      hidden: isManager
    },
    { 
      to: '/godowns', 
      label: 'Godowns', 
      icon: HomeModernIcon,
      summary: 'Warehouse management',
      hidden: isManager
    },
    { 
      to: '/stores', 
      label: 'Stores', 
      icon: BuildingStorefrontIcon,
      summary: 'Store locations'
    },
    { 
      to: '/stocks', 
      label: 'Stocks', 
      icon: CubeIcon,
      summary: 'Inventory tracking'
    },
    { 
      to: '/reports', 
      label: 'Reports', 
      icon: ChartBarIcon,
      summary: 'Analytics & insights'
    },
    { 
      to: '/account', 
      label: 'Account', 
      icon: Cog6ToothIcon,
      summary: 'Profile & settings'
    },
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-56'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-lg bg-teal flex items-center justify-center">
                <span className="text-white font-bold text-base">K</span>
              </div>
              <div>
                <span className="text-lg font-black text-black">KVA</span>
                <span className="text-xs font-medium text-gray-600 block -mt-0.5">Enterprise</span>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="mx-auto h-9 w-9 rounded-lg bg-teal flex items-center justify-center">
              <span className="text-white font-bold text-base">K</span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 h-6 w-6 bg-teal rounded-full flex items-center justify-center text-white hover:bg-teal/90 transition-colors shadow-lg z-10"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4" />
        )}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto mt-2">
        {navigationItems.map((item) => {
          if (item.hidden) return null;
          const Icon = item.icon;
          const active = isActive(item.to, item.exact);
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                active 
                  ? 'bg-teal text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-50'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-teal'} transition-colors`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className={`text-xs ${active ? 'text-white/80' : 'text-gray-500'}`}>{item.summary}</div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="h-9 w-9 rounded-lg bg-teal flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors group"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 flex flex-col items-center">
            <div className="h-9 w-9 rounded-lg bg-teal flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            
            <button 
              onClick={onLogout}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

