'use client';

import React from "react";

interface AdminTabsProps {
  activeTab: 'overview' | 'create';
  onTabChange: (tab: 'overview' | 'create') => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex gap-8">
        <button 
          className={`py-2 px-1 transition font-medium ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-700 text-blue-700 font-semibold'
              : 'text-gray-500 hover:text-blue-700'
          }`}
          onClick={() => onTabChange('overview')}
        >
          Overview
        </button>
        <button 
          className={`py-2 px-1 transition font-medium ${
            activeTab === 'create'
              ? 'border-b-2 border-blue-700 text-blue-700 font-semibold'
              : 'text-gray-500 hover:text-blue-700'
          }`}
          onClick={() => onTabChange('create')}
        >
          Create
        </button>
      </nav>
    </div>
  );
}; 