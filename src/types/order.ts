export const DEFAULT_DELIVERY_CHARGE = 80;

export interface CartItem {
  product: {
    name: string;
    bnName: string;
    desc: string;
    bnDesc: string;
    price: number;
    oldPrice: number;
    image: string;
    categoryIndex: number;
    isPopular?: boolean;
    isNewest?: boolean;
  };
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
}

export interface OrderItem {
  name: string;
  bnName: string;
  price: number;
  quantity: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderData {
  orderId: string;
  items: OrderItem[];
  customer: CustomerInfo;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: 'Cash on Delivery';
  orderDate: string;
  orderStatus: string;
}
