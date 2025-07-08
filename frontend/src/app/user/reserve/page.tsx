'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut, FiRefreshCw, FiClock } from "react-icons/fi";
import { Sidebar } from "../../../components/Sidebar";
import { ConcertCard } from "../../../components/ConcertCard";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { useAuth } from "../../../components/AuthProvider";
import { concertService, Concert } from "../../../services/concertService";
import { reservationService, Reservation } from "../../../services/reservationService";
import { Modal } from "../../../components/Modal";

export default function UserReserve() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [concertsData, reservationsData] = await Promise.all([
          concertService.getAllConcerts(),
          reservationService.getUserReservations()
        ]);
        setConcerts(concertsData);
        setReservations(reservationsData);
        setError(null);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReserve = async (concertId: number) => {
    try {
      setLoading(true);
      await reservationService.createReservation(concertId);
      setModal({
        isOpen: true,
        title: 'สำเร็จ',
        message: 'จองคอนเสิร์ตสำเร็จ!',
        type: 'success'
      });
      // Refresh data
      const [concertsData, reservationsData] = await Promise.all([
        concertService.getAllConcerts(),
        reservationService.getUserReservations()
      ]);
      setConcerts(concertsData);
      setReservations(reservationsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการจอง';
      setModal({
        isOpen: true,
        title: 'ข้อผิดพลาด',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (concertId: number) => {
    try {
      setLoading(true);
      await reservationService.cancelReservation(concertId);
      setModal({
        isOpen: true,
        title: 'สำเร็จ',
        message: 'ยกเลิกการจองสำเร็จ!',
        type: 'success'
      });
      // Refresh data
      const [concertsData, reservationsData] = await Promise.all([
        concertService.getAllConcerts(),
        reservationService.getUserReservations()
      ]);
      setConcerts(concertsData);
      setReservations(reservationsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการยกเลิก';
      setModal({
        isOpen: true,
        title: 'ข้อผิดพลาด',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSwitchToAdmin = () => {
    if (user?.role === 'admin') {
      // If user is admin, directly navigate to admin page
      router.push('/admin');
    } else {
      // If user is not admin, redirect to admin login
      logout();
      router.push('/admin/login');
    }
  };

  const sidebarItems = [
    {
      label: "ประวัติการจอง",
      icon: <FiClock />,
      onClick: () => router.push('/user/history'),
    },
    ...(user?.role === 'admin' ? [{
      label: "Switch to Admin",
      icon: <FiRefreshCw />,
      onClick: handleSwitchToAdmin,
    }] : []),
  ];

  const sidebarFooter = (
    <div className="flex flex-col gap-2">
      <div className="px-4 py-2 text-sm text-gray-600">
        ยินดีต้อนรับ, {user?.username}
      </div>
      <button
        className="flex items-center gap-2 px-8 py-3 w-full text-base rounded-lg hover:bg-[#f5f8fa] text-[#222] transition"
        onClick={logout}
      >
        <FiLogOut className="text-lg" /> Logout
      </button>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#f5f8fa]">
        <Sidebar items={sidebarItems} footer={sidebarFooter} title="User" />

        <main className="flex-1 p-8 flex flex-col">
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">กำลังโหลดข้อมูลคอนเสิร์ต...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  ลองใหม่
                </button>
              </div>
            )}

            {!loading && !error && concerts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">ไม่มีคอนเสิร์ตที่สามารถจองได้</p>
              </div>
            )}

            {!loading && !error && concerts.map((concert) => {
              const isReserved = reservations.some(
                reservation => reservation.concertId === concert.id && !reservation.canceled
              );
              
              return (
                <ConcertCard
                  key={concert.id}
                  name={concert.name}
                  description={concert.description}
                  seat={concert.seat}
                  remain_seat={concert.remain_seat}
                  date={concert.date}
                  isReserved={isReserved}
                  onReserve={() => handleReserve(concert.id)}
                  onCancel={() => handleCancel(concert.id)}
                />
              );
            })}
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            © 2024 Free Concert Ticket Booking - User Reserve Page
          </div>
        </main>
      </div>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </ProtectedRoute>
  );
} 