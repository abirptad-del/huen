import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  ShoppingBag,
  User,
} from 'lucide-react';
import { AdminOrder } from '../adminStore';
import { navigateAdmin } from '../adminRouting';

interface OrderDetailPageProps {
  orderId: string;
  orders: AdminOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: AdminOrder['status']) => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({
  orderId,
  orders,
  onUpdateOrderStatus,
}) => {
  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  if (!order) {
    return (
      <div className="bg-white rounded-[14px] p-12 text-center border border-gray-200">
        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-900">Order Not Found</h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">The requested order could not be located.</p>
        <button
          type="button"
          onClick={() => navigateAdmin('/orders')}
          className="px-4 py-2 bg-[#1299E8] text-white text-xs font-semibold rounded-lg"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const [currentStatus, setCurrentStatus] = useState<AdminOrder['status']>(order.status);
  const [showStatusToast, setShowStatusToast] = useState(false);

  const handleStatusChange = (newStatus: AdminOrder['status']) => {
    setCurrentStatus(newStatus);
    onUpdateOrderStatus(order.id, newStatus);
    setShowStatusToast(true);
    setTimeout(() => setShowStatusToast(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateAdmin('/orders')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
                {order.orderNumber}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1299E8] border border-blue-100">
                {currentStatus}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="h-[38px] px-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-[8px] flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {showStatusToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[10px] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Order status updated to <strong>{currentStatus}</strong> successfully!</span>
        </div>
      )}

      {/* TWO COLUMNS: ITEMS & CUSTOMER INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: ORDER ITEMS & FINANCIALS (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Ordered Products ({order.items.length})
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-[8px] object-cover border border-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                      {item.bnName && <p className="text-[11px] text-gray-500">{item.bnName}</p>}
                      {item.variant && (
                        <p className="text-[11px] text-[#1299E8] font-medium">
                          Variant: {item.variant}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        ৳{item.price} &times; {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-gray-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-gray-900">৳{order.deliveryCharge}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-৳{order.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                <span>Total Payable</span>
                <span className="text-[#1299E8] text-base">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes if any */}
          {order.notes && (
            <div className="bg-blue-50/50 rounded-[14px] p-4 border border-blue-100 text-xs">
              <span className="font-bold text-blue-900">Customer Delivery Note:</span>
              <p className="text-blue-800 mt-1">{order.notes}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CUSTOMER & STATUS CONTROLS (1 col) */}
        <div className="space-y-6">
          {/* Status Change Card */}
          <div className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Update Order Status
            </h3>

            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value as AdminOrder['status'])}
              className="w-full h-[42px] px-3 bg-gray-50 text-xs font-semibold text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none cursor-pointer"
            >
              <option value="Pending">Pending (New Order)</option>
              <option value="Processing">Processing (Packed)</option>
              <option value="Shipped">Shipped (With Courier)</option>
              <option value="Delivered">Delivered (Completed)</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Customer Info Card */}
          <div className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
              Customer Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-gray-900">{order.customerName}</div>
                  <div className="text-gray-500">Registered Customer</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <a
                  href={`tel:${order.customerPhone}`}
                  className="font-medium text-[#1299E8] hover:underline font-mono"
                >
                  {order.customerPhone}
                </a>
              </div>

              {order.customerEmail && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600 truncate">{order.customerEmail}</span>
                </div>
              )}

              <div className="flex items-start gap-2.5 pt-2 border-t border-gray-100">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-gray-800">Delivery Address:</div>
                  <p className="text-gray-600 mt-0.5 leading-relaxed">{order.customerAddress}</p>
                  <p className="text-gray-500 mt-0.5">
                    {order.area}, {order.city} {order.postalCode ? `- ${order.postalCode}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
              Payment Details
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Method:</span>
                <span className="font-bold text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Payment Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {order.status === 'Delivered' ? 'Paid on Delivery' : 'Unpaid (Collect on Delivery)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
