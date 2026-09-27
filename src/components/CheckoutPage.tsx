import React, { useState } from 'react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { CartItem, CustomerInfo, OrderData, DEFAULT_DELIVERY_CHARGE } from '../types/order';

interface CheckoutPageProps {
  cart: CartItem[];
  lang: 'en' | 'bn';
  onPlaceOrder: (order: OrderData) => void;
  onReturnToCart: () => void;
  onContinueShopping: () => void;
  deliveryCharge?: number;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  lang,
  onPlaceOrder,
  onReturnToCart,
  onContinueShopping,
  deliveryCharge = DEFAULT_DELIVERY_CHARGE,
}) => {
  const isEn = lang === 'en';

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Dhaka',
    area: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerInfo, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + deliveryCharge;

  const validateField = (field: keyof CustomerInfo, value: string): string => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          return isEn ? 'Full name is required' : 'সম্পূর্ণ নাম আবশ্যক';
        }
        if (value.trim().length < 2) {
          return isEn ? 'Name is too short' : 'নামটি খুব ছোট';
        }
        return '';
      case 'phone':
        if (!value.trim()) {
          return isEn ? 'Phone number is required' : 'ফোন নম্বর আবশ্যক';
        }
        // Basic Bangladesh phone check (at least 10-11 digits)
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) {
          return isEn ? 'Please enter a valid phone number' : 'সঠিক ফোন নম্বর প্রদান করুন';
        }
        return '';
      case 'address':
        if (!value.trim()) {
          return isEn ? 'Full address is required' : 'ঠিকানা আবশ্যক';
        }
        return '';
      case 'city':
        if (!value.trim()) {
          return isEn ? 'City is required' : 'শহর আবশ্যক';
        }
        return '';
      case 'area':
        if (!value.trim()) {
          return isEn ? 'Area / Thana is required' : 'এলাকা / থানা আবশ্যক';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const errorMsg = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  const handleBlur = (field: keyof CustomerInfo) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, customer[field]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert(isEn ? 'Your cart is empty. Please add items before placing an order.' : 'আপনার কার্ট খালি। পণ্য যুক্ত করে অর্ডার করুন।');
      onReturnToCart();
      return;
    }

    // Validate all required fields
    const requiredFields: (keyof CustomerInfo)[] = ['fullName', 'phone', 'address', 'city', 'area'];
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    let hasError = false;

    requiredFields.forEach((field) => {
      const error = validateField(field, customer[field]);
      if (error) {
        newErrors[field] = error;
        hasError = true;
      }
    });

    setTouched({
      fullName: true,
      phone: true,
      address: true,
      city: true,
      area: true,
    });
    setErrors(newErrors);

    if (hasError) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.getElementById(`input-${firstErrorKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    setIsSubmitting(true);

    // Generate unique order ID in format #HV-XXXXXX
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `#HV-${randomNum}`;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const orderData: OrderData = {
      orderId,
      items: cart.map((item) => ({
        name: item.product.name,
        bnName: item.product.bnName,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      })),
      customer,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod: 'Cash on Delivery',
      orderDate: formattedDate,
      orderStatus: 'Order Placed',
    };

    // Save to local storage for persistence across reloads
    try {
      localStorage.setItem('hue_latest_order', JSON.stringify(orderData));
      const existingOrders: OrderData[] = JSON.parse(localStorage.getItem('hue_orders') || '[]');
      existingOrders.unshift(orderData);
      localStorage.setItem('hue_orders', JSON.stringify(existingOrders));
    } catch {
      // ignore storage errors
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onPlaceOrder(orderData);
    }, 400);
  };

  return (
    <div className="w-full min-h-[75vh] bg-[#F8FAFC] pb-16 animate-in fade-in duration-300">
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
          <button
            onClick={onReturnToCart}
            className="hover:text-[#1299E8] transition-colors cursor-pointer font-bold focus:outline-none"
          >
            {isEn ? 'Cart' : 'কার্ট'}
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-semibold">{isEn ? 'Checkout' : 'চেকআউট'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back link */}
        <button
          type="button"
          onClick={onReturnToCart}
          className="inline-flex items-center gap-2 text-xs text-[#1299E8] font-bold hover:underline mb-4 cursor-pointer focus:outline-none select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? 'Back to Cart' : 'কার্টে ফিরে যান'}</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight mb-8">
          {isEn ? 'Checkout' : 'চেকআউট'}
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-gray-200 p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {isEn ? 'Your cart is empty' : 'আপনার কার্ট খালি'}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              {isEn ? 'Please add products before proceeding with checkout.' : 'চেকআউট করার পূর্বে পণ্য নির্বাচন করুন।'}
            </p>
            <button
              onClick={onContinueShopping}
              className="px-6 py-2.5 bg-[#1299E8] text-white font-bold text-xs rounded-[6px]"
            >
              {isEn ? 'Browse Products' : 'পণ্য দেখুন'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT SIDE: DELIVERY INFORMATION & PAYMENT METHOD */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Information Card */}
              <div className="bg-white rounded-[14px] border border-gray-200/80 p-5 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    {isEn ? 'Delivery Information' : 'ডেলিভারি তথ্য'}
                  </h2>
                  <span className="text-xs text-gray-400 font-medium">
                    * {isEn ? 'Required fields' : 'বাধ্যতামূলক তথ্য'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name * */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="input-fullName"
                      className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                    >
                      {isEn ? 'Full Name' : 'পূর্ণ নাম'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-fullName"
                      type="text"
                      value={customer.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      placeholder={isEn ? 'e.g. Tanvir Ahmed' : 'যেমন: তানভীর আহমেদ'}
                      className={`w-full h-[46px] px-4 rounded-[8px] border text-sm text-gray-800 transition-colors outline-none ${
                        errors.fullName
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-gray-300 focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
                        <span>•</span> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number * */}
                  <div>
                    <label
                      htmlFor="input-phone"
                      className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                    >
                      {isEn ? 'Phone Number' : 'ফোন নম্বর'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-phone"
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder={isEn ? '01XXXXXXXXX' : '০১XXXXXXXXX'}
                      className={`w-full h-[46px] px-4 rounded-[8px] border text-sm text-gray-800 transition-colors outline-none ${
                        errors.phone
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-gray-300 focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
                        <span>•</span> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="input-email"
                      className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                    >
                      {isEn ? 'Email Address (Optional)' : 'ইমেইল এড্রেস (ঐচ্ছিক)'}
                    </label>
                    <input
                      id="input-email"
                      type="email"
                      value={customer.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder={isEn ? 'name@example.com' : 'name@example.com'}
                      className="w-full h-[46px] px-4 rounded-[8px] border border-gray-300 focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8] text-sm text-gray-800 outline-none"
                    />
                  </div>

                  {/* Full Address * */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="input-address"
                      className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                    >
                      {isEn ? 'Full Address' : 'সম্পূর্ণ ঠিকানা'} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="input-address"
                      rows={2}
                      value={customer.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      placeholder={isEn ? 'House number, Road, Building name' : 'বাসা নং, রোড নং, এলাকা'}
                      className={`w-full p-3 rounded-[8px] border text-sm text-gray-800 transition-colors outline-none resize-none ${
                        errors.address
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-gray-300 focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8]'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
                        <span>•</span> {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City * */}
                  <div>
                    <label
                      htmlFor="input-city"
                      className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                    >
                      {isEn ? 'City' : 'শহর'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-city"
                      type="text"
                      value={customer.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      onBlur={() => handleBlur('city')}
                      placeholder={isEn ? 'Dhaka / Chittagong' : 'ঢাকা / চট্টগ্রাম'}
                      className={`w-full h-[46px] px-4 rounded-[8px] border text-sm text-gray-800 transition-colors outline-none ${
                        errors.city
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-gray-300 focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8]'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
                        <span>•</span> {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Area / Thana * */}
                  <div>
                    <label
                      htmlFor="input-area"
                      className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                    >
                      {isEn ? 'Area / Thana' : 'এলাকা / থানা'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-area"
                      type="text"
                      value={customer.area}
                      onChange={(e) => handleChange('area', e.target.value)}
                      onBlur={() => handleBlur('area')}
                      placeholder={isEn ? 'e.g. Dhanmondi, Mirpur, Gulshan' : 'যেমন: ধানমন্ডি, মিরপুর, গুলশান'}
                      className={`w-full h-[46px] px-4 rounded-[8px] border text-sm text-gray-800 transition-colors outline-none ${
                        errors.area
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-gray-300 focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8]'
                      }`}
                    />
                    {errors.area && (
                      <p className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
                        <span>•</span> {errors.area}
                      </p>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="input-postalCode"
                      className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                    >
                      {isEn ? 'Postal Code (Optional)' : 'পোস্টাল কোড (ঐচ্ছিক)'}
                    </label>
                    <input
                      id="input-postalCode"
                      type="text"
                      value={customer.postalCode}
                      onChange={(e) => handleChange('postalCode', e.target.value)}
                      placeholder={isEn ? 'e.g. 1205' : 'যেমন: ১২০৫'}
                      className="w-full h-[46px] px-4 rounded-[8px] border border-gray-300 focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8] text-sm text-gray-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="bg-white rounded-[14px] border border-gray-200/80 p-5 sm:p-7 shadow-xs">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                  {isEn ? 'Payment Method' : 'পেমেন্ট পদ্ধতি'}
                </h2>

                <div className="border-2 border-[#1299E8] bg-blue-50/40 rounded-[10px] p-4 flex items-start gap-3 select-none">
                  <div className="pt-0.5">
                    <div className="w-5 h-5 rounded-full border-2 border-[#1299E8] flex items-center justify-center bg-white">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1299E8]"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-900">
                        {isEn ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি (COD)'}
                      </h3>
                      <span className="text-[11px] font-bold bg-[#1299E8]/10 text-[#1299E8] px-2 py-0.5 rounded">
                        {isEn ? 'Recommended' : 'জনপ্রিয়'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {isEn ? 'Pay with cash when your order arrives at your doorstep.' : 'পণ্য হাতে পেয়ে দেখে ক্যাশ মূল্য পরিশোধ করুন।'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: YOUR ORDER SUMMARY & PLACE ORDER BUTTON */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-[14px] border border-gray-200/80 p-5 sm:p-6 shadow-xs sticky top-6 space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h2 className="text-lg font-bold text-gray-900">
                    {isEn ? 'Your Order' : 'আপনার অর্ডার'}
                  </h2>
                  <span className="text-xs font-bold text-gray-500">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} {isEn ? 'items' : 'টি পণ্য'}
                  </span>
                </div>

                {/* Product List */}
                <div className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto pr-1">
                  {cart.map((item, idx) => {
                    const prodName = isEn ? item.product.name : item.product.bnName;
                    const itemSubtotal = item.product.price * item.quantity;

                    return (
                      <div key={idx} className="py-3 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-[8px] bg-gray-50 border border-gray-200/80 overflow-hidden shrink-0">
                          <img
                            src={item.product.image}
                            alt={prodName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {prodName}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                            <span>৳{item.product.price} × {item.quantity}</span>
                            {item.selectedColor && (
                              <span className="text-[10px] bg-gray-100 text-gray-700 px-1 rounded">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[10px] bg-gray-100 text-gray-700 px-1 rounded">
                                {item.selectedSize}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-sm font-bold text-gray-900 shrink-0">
                          ৳{itemSubtotal}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal & Delivery */}
                <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{isEn ? 'Subtotal' : 'সাবটোটাল'}</span>
                    <span className="font-bold text-gray-900">৳{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>{isEn ? 'Delivery Charge' : 'ডেলিভারি চার্জ'}</span>
                    <span className="font-bold text-gray-900">৳{deliveryCharge}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex items-baseline justify-between">
                    <span className="text-base font-bold text-gray-900">
                      {isEn ? 'Total' : 'সর্বমোট'}
                    </span>
                    <span className="text-2xl font-extrabold text-[#1299E8] tracking-tight">
                      ৳{total}
                    </span>
                  </div>
                </div>

                {/* PLACE ORDER PRIMARY BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[52px] bg-[#1299E8] hover:bg-[#0e8cd6] active:bg-[#0b78b9] text-white font-bold text-base rounded-[8px] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none select-none disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {isSubmitting
                      ? isEn
                        ? 'Placing Order...'
                        : 'অর্ডার প্রক্রিয়া করা হচ্ছে...'
                      : isEn
                      ? 'Place Order'
                      : 'অর্ডার সম্পন্ন করুন'}
                  </span>
                </button>

                {/* Trust Information */}
                <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isEn ? 'No advance payment needed for Cash on Delivery' : 'অগ্রিম পেমেন্ট ছাড়াই অর্ডার করুন'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#1299E8] shrink-0" />
                    <span>{isEn ? 'Delivery within 24-72 hours' : '২৪-৭২ ঘণ্টার মধ্যে নিরাপদ ডেলিভারি'}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
