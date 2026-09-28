import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Percent,
  DollarSign,
  X,
} from 'lucide-react';
import { AdminCoupon } from '../adminStore';

interface CouponsPageProps {
  coupons: AdminCoupon[];
  onSaveCoupon: (coupon: AdminCoupon) => void;
  onDeleteCoupon: (id: string) => void;
}

export const CouponsPage: React.FC<CouponsPageProps> = ({
  coupons,
  onSaveCoupon,
  onDeleteCoupon,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minSpend, setMinSpend] = useState('1000');
  const [usageLimit, setUsageLimit] = useState('100');
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const handleOpenModal = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('10');
    setMinSpend('1000');
    setUsageLimit('100');
    setExpiresAt('2026-12-31');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: AdminCoupon = {
      id: `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue) || 0,
      minSpend: Number(minSpend) || 0,
      usageLimit: Number(usageLimit) || 0,
      usedCount: 0,
      expiresAt,
      status: 'Active',
    };

    onSaveCoupon(newCoupon);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Coupons & Discount Codes
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Create promotional discounts for storefront checkouts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="h-[42px] px-4 bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-xs sm:text-sm font-semibold rounded-[10px] flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* COUPONS TABLE */}
      <div className="bg-white rounded-[14px] border border-gray-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 border-b border-gray-200/70 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min. Spend</th>
                <th className="py-3.5 px-4">Usage / Limit</th>
                <th className="py-3.5 px-4">Expires On</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-black text-sm text-[#1299E8] bg-blue-50 px-2.5 py-1 rounded-[6px] border border-blue-200">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `৳${c.discountValue} FLAT OFF`}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">৳{c.minSpend.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-gray-700 font-medium">
                    {c.usedCount} / {c.usageLimit}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">{c.expiresAt}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteCoupon(c.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE COUPON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[16px] w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Create New Coupon</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER25"
                  className="w-full h-[38px] px-3 bg-gray-50 text-xs font-mono font-bold text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'flat')}
                    className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="10"
                    className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Min. Spend (৳)
                  </label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-[8px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1299E8] hover:bg-[#0e8cd6] rounded-[8px]"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
