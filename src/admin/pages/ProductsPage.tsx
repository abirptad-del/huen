import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AdminProduct, AdminCategory } from '../adminStore';
import { navigateAdmin } from '../adminRouting';

interface ProductsPageProps {
  products: AdminProduct[];
  categories: AdminCategory[];
  onDeleteProduct: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categories,
  onDeleteProduct,
  onToggleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.bnName && p.bnName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.categoryIndex.toString() === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'published' && p.status === 'Published') ||
      (selectedStatus === 'draft' && p.status === 'Draft') ||
      (selectedStatus === 'lowstock' && p.stock <= 15);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Products Catalog</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage your store inventory, pricing, categories and stock levels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateAdmin('/products/new')}
          className="h-[42px] px-4 bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-xs sm:text-sm font-semibold rounded-[10px] flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* FILTER & SEARCH CARD */}
      <div className="bg-white rounded-[14px] p-4 border border-gray-200/70 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title, Bengali name or SKU..."
            className="w-full h-[40px] pl-10 pr-4 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-[220px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-[40px] px-3 bg-gray-50 text-xs text-gray-800 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none cursor-pointer"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.index.toString()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-[170px]">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-[40px] px-3 bg-gray-50 text-xs text-gray-800 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="lowstock">Low Stock (≤ 15)</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-[14px] border border-gray-200/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 border-b border-gray-200/70 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-semibold">No products found</p>
                    <p className="text-xs">Try adjusting your search terms or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-[8px] object-cover border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 line-clamp-1">{p.name}</div>
                          {p.bnName && <div className="text-[11px] text-gray-500 truncate">{p.bnName}</div>}
                          {p.isPopular && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 rounded mt-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">{p.categoryName}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">{p.sku}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">৳{p.price}</div>
                      {p.oldPrice && (
                        <div className="text-[10px] text-gray-400 line-through">৳{p.oldPrice}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          p.stock <= 5
                            ? 'text-red-600 font-bold'
                            : p.stock <= 15
                            ? 'text-amber-600'
                            : 'text-gray-700'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(p.id)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer transition-colors ${
                          p.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => navigateAdmin(`/products/${p.id}/edit`)}
                          className="p-1.5 text-gray-500 hover:text-[#1299E8] hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
