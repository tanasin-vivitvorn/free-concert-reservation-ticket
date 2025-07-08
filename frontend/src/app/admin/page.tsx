'use client';

import React, { useEffect, useState } from "react";
import { FiUsers, FiSave } from "react-icons/fi";
import { ConcertCard } from "../../components/ConcertCard";
import { AdminLayout } from "../../components/AdminLayout";
import { AdminTabs } from "../../components/AdminTabs";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { concertService } from "../../services/concertService";
import { reservationService } from "../../services/reservationService";
import { Modal } from "../../components/Modal";

interface Concert {
  id: number;
  name: string;
  description: string;
  seat: number;
  remain_seat?: number;
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'create'>('overview');
  const [stats, setStats] = useState({ totalSeats: 0, reserved: 0, cancelled: 0 });
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    seat: 500,
    date: '',
  });

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/user/reserve');
      return;
    }
    
    if (isAuthenticated && user?.role === 'admin') {
      fetchConcerts();
      fetchStats();
    }
  }, [isAuthenticated, user, router]);

  const fetchStats = async () => {
    try {
      const statsData = await reservationService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchConcerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const concertsData = await concertService.getAllConcerts();
      setConcerts(concertsData);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await concertService.deleteConcert(id);
        
        fetchConcerts();
        setModal({
          isOpen: true,
          title: 'สำเร็จ',
          message: 'ลบคอนเสิร์ตสำเร็จ',
          type: 'success',
        });
      } catch (err) {
        console.error('Delete Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'ลบไม่สำเร็จ';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    setModal({
      isOpen: true,
      title: 'ยืนยันการลบ',
      message: 'คุณต้องการลบคอนเสิร์ตนี้หรือไม่?',
      type: 'warning',
      onConfirm: confirmDelete,
    });
  };

  const handleTabChange = (tab: 'overview' | 'create') => {
    setActiveTab(tab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'seat' ? parseInt(value) || 0 : value,
    }));
  };

  const handleCreateConcert = async () => {
    console.log('handleCreateConcert called!');
    
    console.log('Form data:', formData);
    
    if (!formData.name || !formData.description || !formData.date) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Calling API...');
      await concertService.createConcert({
        name: formData.name,
        description: formData.description,
        seat: formData.seat,
        date: formData.date,
      });
      
      setModal({
        isOpen: true,
        title: 'สำเร็จ',
        message: 'สร้างคอนเสิร์ตสำเร็จ!',
        type: 'success',
      });
      setTimeout(() => {
        router.push('/admin/home');
      }, 1500);
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างคอนเสิร์ต';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout 
        activeTab="home"
        stats={stats}
      >
        <AdminTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        {activeTab === 'overview' && (
          <>
            {error && <div className="text-red-500 mb-4" data-testid="admin-error">{error}</div>}
            {loading && <div className="text-gray-500 mb-4">กำลังโหลด...</div>}
            
            <div className="flex flex-col gap-6">
              {Array.isArray(concerts) && concerts.map((concert) => (
                <ConcertCard
                  key={concert.id}
                  name={concert.name}
                  description={concert.description}
                  seat={concert.seat}
                  remain_seat={concert.remain_seat}
                  onDelete={() => handleDelete(concert.id)}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'create' && (
          <div className="bg-white border border-[#ededed] rounded-sm p-8 mx-auto mt-6">
            <h2 className="text-2xl font-bold text-[#1ca4ef] mb-2">Create</h2>
            <hr className="border-[#ededed] mb-6" />
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-[#212121] mb-2 font-medium">Concert Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Please input concert name"
                    className="w-full border border-[#ededed] rounded-lg px-4 py-2 bg-[#fafbfc] focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[#212121] mb-2 font-medium">Total of seat</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="seat"
                      value={formData.seat}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full border border-[#ededed] rounded-lg px-4 py-2 pr-10 bg-[#fafbfc] focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                      <FiUsers />
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-[#212121] mb-2 font-medium">Date</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border border-[#ededed] rounded-lg px-4 py-2 bg-[#fafbfc] focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[#212121] mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please input description"
                  className="w-full border border-[#ededed] rounded-lg px-4 py-2 min-h-[64px] bg-[#fafbfc] focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none resize-none"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  className="px-7 py-2 font-semibold"
                  disabled={loading}
                  onClick={handleCreateConcert}
                >
                  <FiSave className="text-lg" />
                  {loading ? 'กำลังบันทึก...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
      
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showConfirmButton={modal.type === 'warning'}
        onConfirm={modal.onConfirm}
      />
    </ProtectedRoute>
  );
} 