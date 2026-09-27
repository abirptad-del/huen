import React, { useState } from 'react';
import { Check, Truck, ArrowRight, Copy, CheckCheck, MapPin, Phone, User, Calendar, CreditCard } from 'lucide-react';
import { OrderData } from '../types/order';

interface OrderCompletePageProps {
  order: OrderData | null;
  lang: 'en' | 'bn';
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export const OrderCompletePage: React.FC<OrderCompletePageProps> = ({
  order: propOrder,
  lang,
  onTrackOrder,
  onContinueShopping,
}) => {
  const isEn = lang === 'en';
  const [copied, setCopied] = useState(false);

  // If propOrder is null, fallback to localStorage
  const order: OrderData | null =
    propOrder ||
    (() => {
      try {
        const saved = localStorage.getItem('hue_latest_order');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    })();

  const handleCopy = () => {
    if (!order?.orderId) return;
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return (
      <div className="w-full min-h-[60vh] bg-[#F8FAFC] py-16 px-4 flex items-center justify-center animate-in fade-in duration-300">
        <div className="bg-white rounded-[16px] border border-gray-200/80 p-8 max-w-md w-full text-center shadow-xs">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {isEn ? 'No Recent Order Found' : 'কোনো সাম্প্রতিক অর্ডার পাওয়া যায়নি'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isEn
              ? 'Please place an order to see confirmation details.'
              : 'অর্ডারের বিবরণ দেখতে অনুগ্রহ করে কেনাকাটা সম্পন্ন করুন।'}
          </p>
          <button
            onClick={onContinueShopping}
            className="w-full h-[46px] bg-[#1299E8] hover:bg-[#0e8cd6] text-white font-bold rounded-[8px] transition-colors"
          >
            {isEn ? 'Start Shopping' : 'কেনাকাটা শুরু করুন'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[75vh] bg-[#F8FAFC] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* SUCCESS HERO HEADER */}
        <div className="bg-white rounded-[16px] border border-gray-200/80 p-6 sm:p-10 text-center shadow-xs">
          {/* Big Green Checkmark */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-5 shadow-xs animate-in zoom-in duration-300">
            <Check className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight mb-2">
            {isEn ? 'Order Placed Successfully!' : 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!'}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-6">
            {isEn
              ? 'Thank you for your order. We are now preparing your items for delivery.'
              : 'আপনার অর্ডারের জন্য ধন্যবাদ। আপনার পণ্যটি দ্রুত ডেলিভারির জন্য প্রস্তুত করা হচ্ছে।'}
          </p>

          {/* ORDER ID BADGE */}
          <div className="inline-flex items-center gap-3 bg-blue-50/70 border border-blue-200/80 rounded-[10px] px-4 py-2.5">
            <span className="text-xs sm:text-sm font-semibold text-gray-600">
              {isEn ? 'Order ID:' : 'অর্ডার আইডি:'}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#1299E8] tracking-wider font-mono">
              {order.orderId}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              title={isEn ? 'Copy Order ID' : 'অর্ডার আইডি কপি করুন'}
              className="p-1.5 hover:bg-white rounded text-gray-500 hover:text-[#1299E8] transition-colors cursor-pointer focus:outline-none"
            >
              {copied ? (
                <CheckCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Quick Info bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100 text-left">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <span className="block text-[11px] text-gray-400 font-semibold">{isEn ? 'Order Date' : 'তারিখ'}</span>
                <span className="text-xs font-bold text-gray-700">{order.orderDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="block text-[11px] text-gray-400 font-semibold">{isEn ? 'Payment' : 'পেমেন্ট'}</span>
                <span className="text-xs font-bold text-gray-700">{order.paymentMethod}</span>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
              <div>
                <span className="block text-[11px] text-gray-400 font-semibold">{isEn ? 'Status' : 'স্ট্যাটাস'}</span>
                <span className="text-xs font-bold text-emerald-600">{order.orderStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY CARD */}
        <div className="bg-white rounded-[16px] border border-gray-200/80 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
            {isEn ? 'Order Summary' : 'অর্ডার বিবরণী'}
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => {
              const prodName = isEn ? item.name : item.bnName;
              return (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-[8px] bg-gray-50 border border-gray-200/70 overflow-hidden shrink-0">
                      <img src={item.image} alt={prodName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{prodName}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span>৳{item.price} × {item.quantity}</span>
                        {item.selectedColor && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-medium">
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-medium">
                            {item.selectedSize}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-gray-900 shrink-0">
                    ৳{item.price * item.quantity}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing calculations */}
          <div className="border-t border-gray-100 pt-4 mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{isEn ? 'Subtotal' : 'সাবটোটাল'}</span>
              <span className="font-bold text-gray-900">৳{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{isEn ? 'Delivery Charge' : 'ডেলিভারি চার্জ'}</span>
              <span className="font-bold text-gray-900">৳{order.deliveryCharge}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">{isEn ? 'Total' : 'সর্বমোট'}</span>
              <span className="text-2xl font-extrabold text-[#1299E8] tracking-tight">
                ৳{order.total}
              </span>
            </div>
          </div>
        </div>

        {/* DELIVERY INFORMATION CARD */}
        <div className="bg-white rounded-[16px] border border-gray-200/80 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
            {isEn ? 'Delivery Information' : 'ডেলিভারি তথ্য'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
              <div>
                <span className="block text-xs text-gray-400 font-semibold">{isEn ? 'Recipient' : 'গ্রাহকের নাম'}</span>
                <span className="font-bold text-gray-800">{order.customer.fullName}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
              <div>
                <span className="block text-xs text-gray-400 font-semibold">{isEn ? 'Phone Number' : 'ফোন নম্বর'}</span>
                <span className="font-bold text-gray-800">{order.customer.phone}</span>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-start gap-3 border-t border-gray-50 pt-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
              <div>
                <span className="block text-xs text-gray-400 font-semibold">{isEn ? 'Delivery Address' : 'ডেলিভারি ঠিকানা'}</span>
                <p className="font-bold text-gray-800 leading-relaxed">
                  {order.customer.address}, {order.customer.area}, {order.customer.city}
                  {order.customer.postalCode ? ` - ${order.customer.postalCode}` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS: TRACK ORDER & CONTINUE SHOPPING */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Track Order */}
          <button
            type="button"
            onClick={() => onTrackOrder(order.orderId)}
            className="h-[52px] bg-[#1299E8] hover:bg-[#0e8cd6] text-white font-bold text-base rounded-[8px] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none select-none"
          >
            <Truck className="w-5 h-5" />
            <span>{isEn ? 'Track Order' : 'অর্ডার ট্র্যাক করুন'}</span>
          </button>

          {/* Continue Shopping */}
          <button
            type="button"
            onClick={onContinueShopping}
            className="h-[52px] bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-base rounded-[8px] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none select-none"
          >
            <span>{isEn ? 'Continue Shopping' : 'কেনাকাটা চালিয়ে যান'}</span>
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
