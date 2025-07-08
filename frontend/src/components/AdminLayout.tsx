'use client';

import React from "react";
import { Sidebar } from "./Sidebar";
import { FiUsers, FiAward, FiXCircle } from "react-icons/fi";
import { useAuth } from "./AuthProvider";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: 'home' | 'create' | 'history';
  title?: string;
  stats?: {
    totalSeats: number;
    reserved: number;
    cancelled: number;
  };
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab = 'home',
  title = 'Admin',
  stats = { totalSeats: 0, reserved: 120, cancelled: 12 }
}) => {
  const { logout } = useAuth();
  
  const sidebarItems = [
    {
      label: "Home",
      icon: "🏠",
      active: activeTab === 'home',
      onClick: () => window.location.href = '/admin'
    },
    {
      label: "History",
      icon: "📋",
      active: activeTab === 'history',
      onClick: () => window.location.href = '/admin/history'
    },
    {
      label: "Switch to user",
      icon: "🔄",
      onClick: () => window.location.href = '/user/reserve'
    },
  ];

  const sidebarFooter = (
    <button 
      onClick={logout}
      className="text-sm text-gray-500 hover:underline text-left"
    >
      ↩ Logout
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar
          items={sidebarItems}
          footer={sidebarFooter}
          title={title}
        />
        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-10">
          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="admin-card-total text-white rounded-sm p-6 flex flex-col items-center">
              <FiUsers className="text-3xl mb-2" />
              <div className="text-lg">Total of seats</div>
              <div className="text-3xl font-bold">{stats.totalSeats}</div>
            </div>
            <div className="admin-card-reserve text-white rounded-sm p-6 flex flex-col items-center">
              <FiAward className="text-3xl mb-2" />
              <div className="text-lg">Reserve</div>
              <div className="text-3xl font-bold">{stats.reserved}</div>
            </div>
            <div className="admin-card-cancel text-white rounded-sm p-6 flex flex-col items-center">
              <FiXCircle className="text-3xl mb-2" />
              <div className="text-lg">Cancel</div>
              <div className="text-3xl font-bold">{stats.cancelled}</div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}; 