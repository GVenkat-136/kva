import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Card({ to, title, icon, description, count, hidden }) {
  if (hidden) return null;
  return (
    <Link to={to} className="block group">
      <motion.div 
        whileHover={{ y: -4, scale: 1.01 }} 
        className="relative rounded-2xl p-5 bg-white shadow-lg border border-gray-200 hover:border-teal hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-teal bg-opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500"></div>
        
        <div className="relative z-10">
          {/* Icon and Count */}
          <div className="flex items-start justify-between mb-3">
            <div className="h-11 w-11 rounded-xl bg-teal bg-opacity-10 text-teal flex items-center justify-center group-hover:bg-teal group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-sm">
              {icon}
            </div>
            {count !== undefined && (
              <div className="text-right">
                <div className="text-2xl font-bold text-black group-hover:text-teal transition-colors duration-300">{count}</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Items</div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="mb-3">
            <h3 className="font-bold text-lg text-black mb-1 group-hover:text-teal transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          {/* Action */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 group-hover:border-teal transition-colors duration-300">
            <div className="flex items-center text-teal font-semibold text-xs group-hover:translate-x-1 transition-transform duration-300">
              View Details
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </div>
            <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-all duration-300">
              <ArrowRightIcon className="w-3 h-3" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}



