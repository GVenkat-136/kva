import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({ open, title, children, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, size = 'md' }) {
  if (!open) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className={`relative z-10 w-full ${sizeClasses[size]} rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-black text-gray-900">{title}</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
        
        {/* Footer - Only show if onConfirm is provided */}
        {onConfirm && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button 
              className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-white transition-colors font-semibold text-gray-700"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button 
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors font-semibold shadow-md"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


