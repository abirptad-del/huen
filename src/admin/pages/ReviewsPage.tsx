import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  Check,
  X,
} from 'lucide-react';
import { AdminReview } from '../adminStore';

interface ReviewsPageProps {
  reviews: AdminReview[];
  onUpdateReviewStatus: (id: string, status: AdminReview['status']) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  reviews,
  onUpdateReviewStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = reviews.filter(
    (r) =>
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Customer Reviews & Ratings ({reviews.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Moderate product reviews submitted by verified buyers.
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
            placeholder="Search reviews by product, customer name or review text..."
            className="w-full h-[40px] pl-10 pr-4 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-3">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-xs text-gray-900">{rev.productName}</span>
                {rev.verifiedPurchase && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified Purchase
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-700 italic">"{rev.comment}"</p>

              <div className="text-[11px] text-gray-400">
                By <span className="font-semibold text-gray-700">{rev.customerName}</span> on {rev.date}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  rev.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {rev.status}
              </span>

              {rev.status !== 'Approved' && (
                <button
                  type="button"
                  onClick={() => onUpdateReviewStatus(rev.id, 'Approved')}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-md transition-colors cursor-pointer"
                  title="Approve Review"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}

              {rev.status !== 'Rejected' && (
                <button
                  type="button"
                  onClick={() => onUpdateReviewStatus(rev.id, 'Rejected')}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors cursor-pointer"
                  title="Hide/Reject Review"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
