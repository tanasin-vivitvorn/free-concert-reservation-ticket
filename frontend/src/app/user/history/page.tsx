'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut, FiRefreshCw, FiClock, FiCalendar } from "react-icons/fi";
import { Sidebar } from "../../../components/Sidebar";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { useAuth } from "../../../components/AuthProvider";
import { reservationService, Reservation } from "../../../services/reservationService";
import { concertService, Concert } from "../../../services/concertService";

interface ReservationWithConcert extends Reservation {
  concert: Concert;
}

export default function UserHistory() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationWithConcert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reservationsData = await reservationService.getUserReservations();
        
        // Fetch concert details for each reservation
        const reservationsWithConcerts = await Promise.all(
          reservationsData.map(async (reservation) => {
            const concert = await concertService.getConcertById(reservation.concertId);
            return {
              ...reservation,
              concert,
            };
          })
        );
        
        setReservations(reservationsWithConcerts);
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

  const handleSwitchToAdmin = () => {
    if (user?.role === 'admin') {
      router.push('/admin');
    } else {
      logout();
      router.push('/admin/login');
    }
  };

  const sidebarItems = [
    {
      label: "จองคอนเสิร์ต",
      icon: <FiCalendar />,
      onClick: () => router.push('/user/reserve'),
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (reservation: ReservationWithConcert) => {
    if (reservation.canceled) {
      return 'ยกเลิกแล้ว';
    }
    
    const eventDate = new Date(reservation.concert.date);
    const now = new Date();
    
    if (eventDate < now) {
      return 'จบแล้ว';
    }
    
    return 'กำลังจะมาถึง';
  };

  const getStatusColor = (reservation: ReservationWithConcert) => {
    if (reservation.canceled) {
      return 'text-red-600';
    }
    
    const eventDate = new Date(reservation.concert.date);
    const now = new Date();
    
    if (eventDate < now) {
      return 'text-gray-600';
    }
    
    return 'text-green-600';
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#f5f8fa]">
        <Sidebar items={sidebarItems} footer={sidebarFooter} title="User History" />

        <main className="flex-1 p-8 flex flex-col">
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-6">
              <FiClock className="text-2xl text-[#1ca4ef]" />
              <h1 className="text-3xl font-bold text-[#1ca4ef]">ประวัติการจอง</h1>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">กำลังโหลดประวัติการจอง...</p>
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

            {!loading && !error && reservations.length === 0 && (
              <div className="text-center py-8">
                <FiClock className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">ยังไม่มีประวัติการจอง</p>
                <button 
                  onClick={() => router.push('/user/reserve')}
                  className="mt-4 px-6 py-2 bg-[#1ca4ef] text-white rounded-lg hover:bg-[#1890ff] transition"
                >
                  ไปจองคอนเสิร์ต
                </button>
              </div>
            )}

            {!loading && !error && reservations.length > 0 && (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div 
                    key={reservation.id} 
                    className="bg-white border border-[#ededed] rounded-lg shadow p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#1ca4ef] mb-2">
                          {reservation.concert.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{reservation.concert.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">วันที่จัดงาน:</span>
                            <span className="ml-2 text-gray-600">
                              {formatDate(reservation.concert.date)}
                            </span>
                          </div>

                          <div>
                            <span className="font-medium text-gray-700">จำนวนที่นั่ง:</span>
                            <span className="ml-2 text-gray-600">
                              {reservation.concert.seat.toLocaleString()} ที่นั่ง
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">สถานะ:</span>
                            <span className={`ml-2 font-medium ${getStatusColor(reservation)}`}>
                              {getStatusText(reservation)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center text-gray-400 text-sm">
            © 2024 Free Concert Ticket Booking - User History Page
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 