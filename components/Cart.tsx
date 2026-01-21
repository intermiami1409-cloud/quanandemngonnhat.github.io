
import React, { useState, useEffect } from 'react';
import { OrderItem, Dish } from '../types';
import { TABLES } from '../constants';
import { getSmartRecommendation } from '../services/geminiService';

interface CartProps {
  items: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onSubmitOrder: (tableNumber: string) => void;
  onBack: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onSubmitOrder, onBack }) => {
  const [selectedTable, setSelectedTable] = useState('');
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (items.length > 0) {
      setLoadingAi(true);
      getSmartRecommendation(items.map(i => i.name))
        .then(tip => setAiTip(tip))
        .finally(() => setLoadingAi(false));
    }
  }, [items.length === 0]); // Run once when cart becomes non-empty or items change significantly

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold">Xác nhận đặt món</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">Danh sách món đã chọn</h3>
        {items.length === 0 ? (
          <p className="text-center py-8 text-gray-400">Giỏ hàng đang trống</p>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-orange-600 text-sm">{item.price.toLocaleString('vi-VN')}đ</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="font-semibold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {aiTip && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 relative overflow-hidden">
          <div className="flex gap-3">
            <div className="bg-blue-500 text-white rounded-full p-1 h-fit">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Gợi ý từ Gemini Chef</p>
              <p className="text-sm text-blue-800 italic">"{aiTip}"</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <label className="block font-semibold text-gray-700 mb-2">Chọn số bàn</label>
        <div className="grid grid-cols-3 gap-2">
          {TABLES.map(table => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`py-2 px-1 rounded-lg border text-sm transition-colors ${
                selectedTable === table 
                ? 'bg-orange-600 text-white border-orange-600' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
              }`}
            >
              {table}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          <div className="flex justify-between items-center px-2">
            <span className="text-gray-500">Tổng cộng:</span>
            <span className="text-2xl font-bold text-orange-600">{totalPrice.toLocaleString('vi-VN')}đ</span>
          </div>
          <button
            disabled={!selectedTable || items.length === 0}
            onClick={() => onSubmitOrder(selectedTable)}
            className={`w-full py-4 rounded-full font-bold shadow-lg transition-all active:scale-95 ${
              !selectedTable || items.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            {selectedTable ? `Gửi đơn - ${selectedTable}` : 'Vui lòng chọn bàn'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
