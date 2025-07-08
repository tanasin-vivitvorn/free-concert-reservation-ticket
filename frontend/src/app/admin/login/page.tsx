"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthProvider";
import { authService } from "../../../services/authService";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authService.login({ username, password });
      
      if (data.user.role !== 'admin') {
        throw new Error("คุณไม่มีสิทธิ์เข้าถึงหน้า Admin");
      }
      
      login(data.access_token, data.user);
      router.push("/admin");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-indigo-700 mb-2">Admin Login</h1>
          <p className="text-gray-600 text-sm">เข้าสู่ระบบสำหรับผู้ดูแลระบบ</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="กรอก username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="กรอก password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ Admin"}
        </button>
        
        <div className="text-center text-sm text-gray-600">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-indigo-600 hover:underline"
          >
            ← กลับไปหน้า User Login
          </button>
        </div>
      </form>
    </div>
  );
} 