
import React, { useState, useEffect } from 'react';
import { User, View, Dish, OrderItem, Order } from './types';
import Auth from './components/Auth';
import Menu from './components/Menu';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Tải đơn hàng từ localStorage khi khởi động
  useEffect(() => {
    const savedOrders = localStorage.getItem('gourmet_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    // Lắng nghe sự thay đổi từ các tab khác (nếu mở Admin ở tab khác)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gourmet_orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Đồng bộ orders vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('gourmet_orders', JSON.stringify(orders));
  }, [orders]);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    setView(loggedUser.role === 'admin' ? 'admin' : 'menu');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setCart([]);
  };

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const submitOrder = (tableNumber: string) => {
    if (!user) return;
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tableNumber,
      items: [...cart],
      totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pending',
      customerName: user.username,
      createdAt: new Date().toISOString()
    };

    // Cập nhật state cục bộ và đơn hàng sẽ tự động sync vào localStorage qua useEffect
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    setView('order-success');
  };

  const updateOrderStatus = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'completed' } : o));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 selection:bg-orange-100 selection:text-orange-900">
      {/* Header */}
      {view !== 'login' && view !== 'register' && (
        <header className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="font-black text-gray-800 text-xl tracking-tight leading-none">Gourmet</h1>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Express POS</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Đang đăng nhập</p>
              <p className="text-sm font-bold text-gray-700">{user?.username}</p>
            </div>
            {user?.role === 'customer' && (
              <button 
                onClick={handleLogout} 
                className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                title="Đăng xuất"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {view === 'login' && <Auth onLogin={handleLogin} initialMode="login" onToggleMode={() => setView('register')} />}
        {view === 'register' && <Auth onLogin={handleLogin} initialMode="register" onToggleMode={() => setView('login')} />}
        {view === 'menu' && <Menu onAddToCart={addToCart} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onGoToCart={() => setView('cart')} />}
        {view === 'cart' && <Cart items={cart} onUpdateQuantity={updateCartQuantity} onSubmitOrder={submitOrder} onBack={() => setView('menu')} />}
        {view === 'admin' && <AdminDashboard orders={orders} onUpdateStatus={updateOrderStatus} onLogout={handleLogout} />}
        
        {view === 'order-success' && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-300">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
              <div className="relative w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-3">Đã gửi đơn hàng!</h2>
            <p className="text-gray-500 mb-10 max-w-xs mx-auto font-medium">
              Thông tin món ăn và số bàn của bạn đã được chuyển thẳng tới tài khoản Admin.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => setView('menu')}
                className="w-full bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all active:scale-[0.98]"
              >
                Tiếp tục đặt thêm món
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-white text-gray-500 px-8 py-4 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                Thử đăng nhập Admin để xem đơn
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
