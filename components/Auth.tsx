
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  initialMode: 'login' | 'register';
  onToggleMode: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, initialMode, onToggleMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert('Vui lòng điền đầy đủ thông tin');

    // Simple mock auth logic
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      onLogin({ id: 'admin', username: 'Quản trị viên', role: 'admin' });
    } else {
      onLogin({ id: Math.random().toString(), username, role: 'customer' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-orange-50">
      <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl border border-orange-100">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-orange-100 rounded-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Gourmet Express</h2>
          <p className="text-gray-500 mt-2 font-medium">
            {initialMode === 'login' ? 'Vui lòng đăng nhập để bắt đầu' : 'Tạo tài khoản khách hàng mới'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
            <input
              type="text"
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 transition-all outline-none font-medium"
              placeholder="admin hoặc tên bất kỳ..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 transition-all outline-none font-medium"
              placeholder="Mật khẩu của bạn..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 active:scale-[0.97]"
          >
            {initialMode === 'login' ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <button onClick={onToggleMode} className="w-full text-gray-400 text-sm font-semibold hover:text-orange-600 transition-colors">
            {initialMode === 'login' ? 'Bạn là khách hàng mới? Đăng ký' : 'Đã có tài khoản? Quay lại đăng nhập'}
          </button>
        </div>

        {/* Admin Hint Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-2 text-center">Chế độ quản trị (Dành cho chủ quán)</p>
          <div className="flex justify-center gap-2">
            <code className="bg-white px-2 py-1 rounded border text-xs text-orange-600 font-bold">User: admin</code>
            <code className="bg-white px-2 py-1 rounded border text-xs text-orange-600 font-bold">Pass: admin</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
