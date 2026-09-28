import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartItem, DEFAULT_DELIVERY_CHARGE } from '../types/order';

interface CartPageProps {
  cart: CartItem[];
  lang: 'en' | 'bn';
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  deliveryCharge?: number;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  lang,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  deliveryCharge = DEFAULT_DELIVERY_CHARGE,
}) => {
  const isEn = lang === 'en';

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryCharge;

  return (
    <div className="w-full min-h-[70vh] bg-[#F8FAFC] pb-16 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <div className="w-full bg-white border-b border-gray-100 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-500 font-medium select-none">
          <button
            onClick={onContinueShopping}
            className="hover:text-[#1299E8] transition-colors cursor-pointer font-bold focus:outline-none"
          >
            {isEn ? 'Home' : 'হোম'}
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-semibold">{isEn ? 'Shopping Cart' : 'শপিং কার্ট'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight flex items-center gap-3">
            <span>{isEn ? 'Your Shopping Cart' : 'আপনার শপিং কার্ট'}</span>
            {cart.length > 0 && (
              <span className="text-sm font-bold bg-[#1299E8]/10 text-[#1299E8] px-3 py-1 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} {isEn ? 'items' : 'টি পণ্য'}
              </span>
            )}
          </h1>
        </div>

        {cart.length === 0 ? (
          /* EMPTY CART STATE */
          <div className="bg-white rounded-[16px] border border-gray-200/80 p-8 sm:p-16 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8">
            <div className="w-20 h-20 bg-blue-50/70 border border-blue-100 rounded-full flex items-center justify-center text-[#1299E8] mb-5">
              <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {isEn ? 'Your cart is empty' : 'আপনার কার্ট খালি'}
            </h2>
            <p className="text-sm text-gray-500 font-normal leading-relaxed mb-8 max-w-sm">
              {isEn
                ? "Looks like you haven't added anything yet."
                : 'আপনি এখনো কোনো পণ্য কার্টে যুক্ত করেননি।'}
            </p>
            <button
              type="button"
              onClick={onContinueShopping}
              className="h-[48px] px-8 bg-[#1299E8] hover:bg-[#0e8cd6] text-white font-bold text-sm rounded-[8px] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none"
            >
              <span>{isEn ? 'Continue Shopping' : 'কেনাকাটা শুরু করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* POPULATED CART LAYOUT: DESKTOP 2-COLUMN (LEFT ITEMS, RIGHT SUMMARY) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: CART ITEMS */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-[14px] border border-gray-200/80 shadow-xs overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider select-none">
                  <div className="col-span-6">{isEn ? 'Product' : 'পণ্য'}</div>
                  <div className="col-span-2 text-center">{isEn ? 'Price' : 'মূল্য'}</div>
                  <div className="col-span-2 text-center">{isEn ? 'Quantity' : 'পরিমাণ'}</div>
                  <div className="col-span-2 text-right">{isEn ? 'Subtotal' : 'উপ-মোট'}</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.map((item, idx) => {
                    const prodName = isEn ? item.product.name : item.product.bnName;
                    const itemSubtotal = item.product.price * item.quantity;

                    return (
                      <div
                        key={idx}
                        className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
                      >
                        {/* Product Info (Col 6) */}
                        <div className="w-full sm:col-span-6 flex items-center gap-4">
                          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-[10px] bg-gray-50 border border-gray-200/70 overflow-hidden shrink-0">
                            <img
                              src={item.product.image}
                              alt={prodName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate mb-1">
                              {prodName}
                            </h3>

                            {/* Color & Size Badges */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-2 select-none">
                              {item.selectedColor && (
                                <span className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                  {isEn ? 'Color: ' : 'রং: '}{item.selectedColor}
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                  {isEn ? 'Size: ' : 'সাইজ: '}{item.selectedSize}
                                </span>
                              )}
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => onRemoveItem(idx)}
                              className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer transition-colors focus:outline-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isEn ? 'Remove' : 'মুছে ফেলুন'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Unit Price (Col 2) */}
                        <div className="w-full sm:col-span-2 flex sm:justify-center items-center justify-between sm:text-center text-sm font-bold text-gray-800">
                          <span className="sm:hidden text-xs text-gray-400 font-normal">
                            {isEn ? 'Unit Price:' : 'একক মূল্য:'}
                          </span>
                          <span>৳{item.product.price}</span>
                        </div>

                        {/* Quantity Selector (Col 2) */}
                        <div className="w-full sm:col-span-2 flex sm:justify-center items-center justify-between">
                          <span className="sm:hidden text-xs text-gray-400 font-normal">
                            {isEn ? 'Quantity:' : 'পরিমাণ:'}
                          </span>
                          <div className="flex items-center border border-gray-300 rounded-[6px] bg-white h-[34px] overflow-hidden select-none">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  onUpdateQuantity(idx, item.quantity - 1);
                                } else {
                                  onRemoveItem(idx);
                                }
                              }}
                              className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors font-bold cursor-pointer focus:outline-none"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                              className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors font-bold cursor-pointer focus:outline-none"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal (Col 2) */}
                        <div className="w-full sm:col-span-2 flex sm:justify-end items-center justify-between sm:text-right text-base font-extrabold text-[#1299E8]">
                          <span className="sm:hidden text-xs text-gray-400 font-normal">
                            {isEn ? 'Item Total:' : 'মোট:'}
                          </span>
                          <span>৳{itemSubtotal}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Buttons on mobile / desktop */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onContinueShopping}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#1299E8] hover:underline cursor-pointer focus:outline-none select-none"
                >
                  <span>←</span>
                  <span>{isEn ? 'Continue Shopping' : 'আরও কেনাকাটা করুন'}</span>
                </button>
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[14px] border border-gray-200/80 p-5 sm:p-6 shadow-xs sticky top-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                  {isEn ? 'Order Summary' : 'অর্ডার সারাংশ'}
                </h2>

                <div className="space-y-3 text-sm">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-gray-600">
                    <span>{isEn ? 'Subtotal' : 'সাবটোটাল'}</span>
                    <span className="font-bold text-gray-900">৳{subtotal}</span>
                  </div>

                  {/* Delivery Charge */}
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <span>{isEn ? 'Delivery Charge' : 'ডেলিভারি চার্জ'}</span>
                    </div>
                    <span className="font-bold text-gray-900">৳{deliveryCharge}</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold text-gray-900">{isEn ? 'Total' : 'সর্বমোট'}</span>
                      <span className="text-2xl font-extrabold text-[#1299E8] tracking-tight">
                        ৳{total}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {isEn ? 'Including VAT & Delivery across Bangladesh' : 'ভ্যাট ও ডেলিভারি চার্জ অন্তর্ভুক্ত'}
                    </p>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="w-full h-[50px] bg-[#1299E8] hover:bg-[#0e8cd6] text-white font-bold text-base rounded-[8px] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none select-none"
                >
                  <span>{isEn ? 'Proceed to Checkout' : 'চেকআউটে এগিয়ে যান'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Action */}
                <button
                  type="button"
                  onClick={onContinueShopping}
                  className="w-full h-[44px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-[8px] flex items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none select-none"
                >
                  <span>{isEn ? 'Continue Shopping' : 'কেনাকাটা চালিয়ে যান'}</span>
                </button>

                {/* Trust Badges */}
                <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isEn ? 'Cash on Delivery available nationwide' : 'সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#1299E8] shrink-0" />
                    <span>{isEn ? 'Fast & reliable doorstep delivery' : 'দ্রুত ও নির্ভরযোগ্য হোম ডেলিভারি'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
