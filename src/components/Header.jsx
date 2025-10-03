import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu.jsx';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-teal flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <span className="text-2xl font-black text-black group-hover:text-teal transition-colors duration-300">KVA</span>
              <span className="text-sm font-medium text-gray-600 block -mt-1">Enterprise</span>
            </div>
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}



