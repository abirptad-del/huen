import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  ShoppingBag,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  FileText,
} from 'lucide-react';
import { AdminOrder } from '../adminStore';
import { navigateAdmin } from '../adminRouting';

interface OrdersPageProps {
  orders: AdminOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: AdminOrder['status']) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | AdminOrder['status']>('All');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'All' || o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: AdminOrder['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const tabs: Array<'All' | AdminOrder['status']> = [
    'All',
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Order Management ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Track, process, and update status for all storefront orders.
          </p>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="bg-white rounded-[14px] p-4 border border-gray-200/70 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-100">
          {tabs.map((tab) => {
            const count =
              tab === 'All' ? orders.length : orders.filter((o) => o.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1299E8] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID (#HNV-...), Customer Name, Phone (017...)..."
            className="w-full h-[40px] pl-10 pr-4 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-[14px] border border-gray-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 border-b border-gray-200/70 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Delivery Location</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-semibold">No orders found</p>
                    <p className="text-xs">No orders matching the selected filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => navigateAdmin(`/orders/${ord.id}`)}
                        className="font-mono font-bold text-[#1299E8] hover:underline cursor-pointer"
                      >
                        {ord.orderNumber}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{ord.customerName}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{ord.customerPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800">{ord.city}</div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[160px]">
                        {ord.area}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 text-[13px]">
                        ৳{ord.total.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">{ord.paymentMethod}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(ord.id, e.target.value as AdminOrder['status'])
                        }
                        className={`text-[11px] font-semibold py-1 px-2 rounded-full border cursor-pointer outline-none ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigateAdmin(`/orders/${ord.id}`)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-[#1299E8] text-[#1299E8] hover:text-white font-semibold rounded-[7px] text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
