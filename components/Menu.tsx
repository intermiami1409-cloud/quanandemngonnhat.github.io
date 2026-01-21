
import React from 'react';
import { Dish } from '../types';
import { DISHES } from '../constants';

interface MenuProps {
  onAddToCart: (dish: Dish) => void;
  cartCount: number;
  onGoToCart: () => void;
}

const Menu: React.FC<MenuProps> = ({ onAddToCart, cartCount, onGoToCart }) => {
  return (
    <div className="pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {DISHES.map((dish) => (
          <div key={dish.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">{dish.name}</h3>
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                  {dish.category}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{dish.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-orange-600 font-bold text-lg">
                  {dish.price.toLocaleString('vi-VN')}đ
                </span>
                <button
                  onClick={() => onAddToCart(dish)}
                  className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors"
                  aria-label="Thêm vào giỏ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg flex justify-center">
          <button
            onClick={onGoToCart}
            className="w-full max-w-lg bg-orange-600 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-orange-700 shadow-xl transition-transform active:scale-95"
          >
            <span>Xem giỏ hàng ({cartCount})</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
