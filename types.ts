
export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface OrderItem extends Dish {
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'completed';
  customerName: string;
  createdAt: string;
}

export type View = 'login' | 'register' | 'menu' | 'cart' | 'admin' | 'order-success';
