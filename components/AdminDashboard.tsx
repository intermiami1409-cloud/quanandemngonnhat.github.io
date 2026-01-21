
import React, { useState } from 'react';
import { Order } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (id: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, onUpdateStatus, onLogout }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredOrders = orders
    .filter(o => filter === 'all' || o.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Đơn hàng mới</p>
          <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Tổng doanh thu</p>
          <p className="text-3xl font-bold text-green-600">{totalRevenue.toLocaleString('vi-VN')}đ</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-end justify-between">
          <button
            onClick={onLogout}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Đăng xuất Admin
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Màn hình Điều hành
          <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
        </h2>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Đang chờ' : 'Hoàn tất'}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-gray-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500">Không có đơn hàng nào trong mục này</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className={`p-4 flex justify-between items-center ${order.status === 'pending' ? 'bg-orange-50' : 'bg-green-50'}`}>
                <div>
                  <span className="text-2xl font-black text-gray-800">{order.tableNumber}</span>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                    {new Date(order.createdAt).toLocaleTimeString('vi-VN')} - {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === 'pending' ? 'bg-orange-200 text-orange-700' : 'bg-green-200 text-green-700'
                }`}>
                  {order.status === 'pending' ? 'Mới' : 'Xong'}
                </div>
              </div>

              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                    {order.customerName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700">{order.customerName}</span>
                </div>

                <div className="space-y-3 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded flex items-center justify-center font-bold text-[10px]">
                          {item.quantity}
                        </span>
                        <span className="text-gray-800">{item.name}</span>
                      </div>
                      <span className="text-gray-500 font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 text-sm">Tổng thanh toán:</span>
                    <span className="text-xl font-bold text-orange-600">{order.totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={() => onUpdateStatus(order.id)}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-[0.98]"
                    >
                      Xác nhận đã phục vụ
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
