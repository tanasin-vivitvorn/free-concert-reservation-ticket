'use client';

import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../../components/AdminLayout";
import { reservationService, Reservation } from "../../../services/reservationService";

export default function AdminHistory() {
  const [history, setHistory] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalSeats: 0, reserved: 0, cancelled: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [historyData, statsData] = await Promise.all([
          reservationService.getAllReservations(),
          reservationService.getStats(),
        ]);
        setHistory(historyData);
        setStats(statsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        setError(errorMessage);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getActionColor = (canceled: boolean) => {
    return canceled ? 'text-red-600' : 'text-green-600';
  };

  const getActionText = (canceled: boolean) => {
    return canceled ? 'ยกเลิก' : 'จอง';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH');
  };

  return (
    <AdminLayout 
      activeTab="history"
      stats={stats}
    >
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-[#1ca4ef] mb-6">ประวัติการจองทั้งหมด</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">วันที่/เวลา</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">ผู้ใช้</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">คอนเสิร์ต</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-gray-600">
                      {record.datetime ? formatDateTime(record.datetime) : 
                       record.updatedAt ? formatDateTime(record.updatedAt) : '-'}
                    </td>
                    <td className="py-4 px-6 text-gray-800 font-medium">
                      {record.user?.username || `User ID: ${record.userId}`}
                    </td>
                    <td className="py-4 px-6 text-gray-800">
                      {record.concert?.name || `Concert ID: ${record.concertId}`}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${getActionColor(record.canceled)}`}>
                        {getActionText(record.canceled)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            ไม่มีข้อมูลประวัติการจอง
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 