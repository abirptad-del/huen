import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  ShoppingBag,
  Calendar,
  MapPin,
} from 'lucide-react';
import { AdminCustomer } from '../adminStore';

interface CustomersPageProps {
  customers: AdminCustomer[];
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            View customer order history, contact details, and locations.
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-[14px] p-4 border border-gray-200/70 shadow-xs">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone number, email or city..."
            className="w-full h-[40px] pl-10 pr-4 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-white rounded-[14px] border border-gray-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 border-b border-gray-200/70 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1299E8]/10 text-[#1299E8] font-bold flex items-center justify-center text-xs">
                        {cust.name.charAt(0)}
                      </div>
                      <span>{cust.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-600">{cust.phone}</td>
                  <td className="py-3.5 px-4 text-gray-500">{cust.email}</td>
                  <td className="py-3.5 px-4 text-gray-700">{cust.city}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">
                    {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1299E8]">
                    ৳{cust.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-gray-400">{cust.lastOrderAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
