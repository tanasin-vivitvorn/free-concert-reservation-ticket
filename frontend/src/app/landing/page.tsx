'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "../../components/AuthProvider";
import { Modal } from "../../components/Modal";

export default function Landing() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const handleUserPage = () => {
    if (isAuthenticated) {
      router.push('/user/reserve');
    } else {
      router.push('/login');
    }
  };

  const handleAdminPage = () => {
    if (isAuthenticated && user?.role === 'admin') {
      router.push('/admin');
    } else if (isAuthenticated) {
      setModal({
        isOpen: true,
        title: 'ข้อผิดพลาด',
        message: 'คุณไม่มีสิทธิ์เข้าถึงหน้า Admin',
        type: 'error'
      });
    } else {
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2 text-center">Free Concert Ticket Booking</h1>
        <p className="text-gray-500 text-center mb-4">ระบบจองบัตรคอนเสิร์ตฟรีสำหรับทุกคน<br/>จองง่าย ยกเลิกได้ ดูประวัติย้อนหลัง</p>
        
        {isAuthenticated ? (
          <div className="w-full text-center">
            <p className="text-green-600 mb-4">ยินดีต้อนรับ, {user?.username}!</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleUserPage}
                className="w-full py-2 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
              >
                เข้าสู่หน้า User
              </button>
              {user?.role === 'admin' && (
                <button 
                  onClick={handleAdminPage}
                  className="w-full py-2 px-4 rounded-lg bg-gray-400 text-white font-medium hover:bg-gray-500 transition"
                >
                  เข้าสู่หน้า Admin
                </button>
              )}
              <button 
                onClick={logout}
                className="w-full py-2 px-4 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-50 transition"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            <a href="/login">
              <button 
                className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                เข้าสู่ระบบ
              </button>
            </a>
            <a href="/register">
              <button 
                className="w-full py-2 px-4 rounded-lg border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
              >
                สมัครสมาชิก
              </button>
            </a>
          </div>
        )}
        
        <div className="flex gap-4 mt-6">
          <button 
            onClick={handleUserPage}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            เข้าสู่หน้า User
          </button>
          <button 
            onClick={handleAdminPage}
            className="px-4 py-2 rounded-lg bg-gray-400 text-white font-medium hover:bg-gray-500 transition"
          >
            เข้าสู่หน้า Admin
          </button>
        </div>
      </div>
      <footer className="mt-10 text-gray-400 text-xs">© 2024 Free Concert Ticket Booking</footer>
      
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
} 