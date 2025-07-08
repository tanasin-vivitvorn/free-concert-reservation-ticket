"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { authService } from "../../services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authService.register({ username, email, password });
      login(data.access_token, data.user);
      router.push("/user/reserve");
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
        <h1 className="text-2xl font-bold text-indigo-700 mb-2 text-center">สมัครสมาชิก</h1>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <input
          className="border rounded-lg px-4 py-2"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="border rounded-lg px-4 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border rounded-lg px-4 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>
        <div className="text-center text-sm">
          มีบัญชีแล้ว? <a href="/login" className="text-indigo-600 hover:underline">เข้าสู่ระบบ</a>
        </div>
      </form>
    </div>
  );
} 