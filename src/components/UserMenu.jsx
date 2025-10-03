import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setOpen((v) => !v)} 
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
      >
        <div className="h-10 w-10 rounded-xl bg-teal flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform duration-200">
          {user.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="text-left hidden sm:block">
          <div className="font-semibold text-black text-sm">{user.name}</div>
          <div className="text-gray-600 text-xs capitalize">{user.role}</div>
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal flex items-center justify-center text-white font-bold text-sm">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-semibold text-black text-sm">{user.name}</div>
                <div className="text-gray-600 text-xs capitalize">{user.role}</div>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="py-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group">
              <UserIcon className="w-5 h-5 text-gray-500 group-hover:text-teal transition-colors duration-200" />
              <span className="text-sm font-medium">Profile Settings</span>
            </button>
            
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 group"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



