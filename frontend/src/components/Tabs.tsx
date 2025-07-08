import React from 'react';

interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => (
  <div className="border-b border-[#ededed] mb-8">
    <nav className="flex gap-8">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`py-3 px-2 transition font-medium text-lg
            ${activeTab === tab.value
              ? 'border-b-4 border-[#1ca4ef] text-[#1ca4ef] font-bold rounded-t'
              : 'text-gray-500 hover:text-[#1ca4ef]'
            }`}
          style={{ outline: 'none' }}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);
