import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { AdminProduct, AdminOrder, AdminCustomer } from '../adminStore';
import { navigateAdmin } from '../adminRouting';

interface DashboardPageProps {
  products: AdminProduct[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  products,
  orders,
  customers,
}) => {
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing');
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const lowStockProducts = products.filter((p) => p.stock <= 15);

  const stats = [
    {
      label: 'Total Revenue',
      value: `৳${totalRevenue.toLocaleString()}`,
      change: '+18.4% vs last month',
      trend: 'up',
      icon: TrendingUp,
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      change: `${pendingOrders.length} pending processing`,
      trend: 'up',
      icon: ShoppingBag,
      bgColor: 'bg-[#1299E8]/10',
      textColor: 'text-[#1299E8]',
    },
    {
      label: 'Active Products',
      value: products.length.toString(),
      change: `${lowStockProducts.length} low in stock`,
      trend: 'warning',
      icon: Package,
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600',
    },
    {
      label: 'Total Customers',
      value: customers.length.toString(),
      change: '+12% active customers',
      trend: 'up',
      icon: Users,
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-600',
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* WELCOME BANNER & QUICK ACTIONS */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-[16px] p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1299E8]/20 text-[#1299E8] text-xs font-semibold mb-2">
            <span>Admin 360 Control Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Welcome back, Super Admin</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Store overview: {orders.length} orders total &bull; {pendingOrders.length} orders need your attention today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigateAdmin('/products/new')}
            className="h-[40px] px-4 bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-xs font-semibold rounded-[8px] flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            type="button"
            onClick={() => navigateAdmin('/orders')}
            className="h-[40px] px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-[8px] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-2.5 rounded-[10px] ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TWO COLUMNS: RECENT ORDERS & TOP PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ORDERS TABLE (2 COLS) */}
        <div className="lg:col-span-2 bg-white rounded-[14px] border border-gray-200/70 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Customer Orders</h2>
              <p className="text-xs text-gray-500">Real-time incoming orders from storefront</p>
            </div>
            <button
              type="button"
              onClick={() => navigateAdmin('/orders')}
              className="text-xs font-semibold text-[#1299E8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/70 text-gray-500 border-b border-gray-100 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1299E8]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{ord.customerName}</div>
                      <div className="text-[11px] text-gray-400">{ord.city}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      ৳{ord.total.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigateAdmin(`/orders/${ord.id}`)}
                        className="p-1.5 text-gray-500 hover:text-[#1299E8] hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* POPULAR PRODUCTS & LOW STOCK (1 COL) */}
        <div className="space-y-6">
          {/* Top Selling Products */}
          <div className="bg-white rounded-[14px] border border-gray-200/70 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Top Trending Products</h3>
              <button
                type="button"
                onClick={() => navigateAdmin('/products')}
                className="text-xs font-semibold text-[#1299E8] hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {products.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigateAdmin(`/products/${p.id}/edit`)}
                  className="flex items-center gap-3 p-2 rounded-[10px] hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-11 h-11 rounded-[8px] object-cover border border-gray-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-gray-900 truncate">{p.name}</div>
                    <div className="text-[11px] text-gray-500">
                      {p.categoryName} &bull; Stock: {p.stock}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-gray-900">৳{p.price}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warning Card */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50/60 rounded-[14px] border border-amber-200 p-4">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Low Stock Alert</h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    {lowStockProducts.length} items are running low. Restock soon to prevent order backlogs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
