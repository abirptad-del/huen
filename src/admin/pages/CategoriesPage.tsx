import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Layers,
  X,
  Upload,
  Loader2,
} from 'lucide-react';
import { AdminCategory } from '../adminStore';
import { uploadImageToSupabase } from '../../lib/supabaseService';

interface CategoriesPageProps {
  categories: AdminCategory[];
  onSaveCategory: (cat: AdminCategory) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  onSaveCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [bnName, setBnName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'Active' | 'Hidden'>('Active');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase('category-images', file);
      if (publicUrl) {
        setImage(publicUrl);
      }
    } catch (err) {
      console.error('Category image upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenModal = (cat?: AdminCategory) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setBnName(cat.bnName);
      setDesc(cat.desc);
      setImage(cat.image);
      setStatus(cat.status);
    } else {
      setEditingCategory(null);
      setName('');
      setBnName('');
      setDesc('');
      setImage('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80');
      setStatus('Active');
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminCategory = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      index: editingCategory ? editingCategory.index : categories.length,
      name: name.trim(),
      bnName: bnName.trim(),
      desc: desc.trim(),
      image: image.trim(),
      productCount: editingCategory ? editingCategory.productCount : 0,
      status,
    };

    onSaveCategory(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Store Categories ({categories.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Organize products across all 9 storefront popular categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="h-[42px] px-4 bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-xs sm:text-sm font-semibold rounded-[10px] flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-[14px] border border-gray-200/80 shadow-xs overflow-hidden flex flex-col justify-between p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-16 h-16 rounded-[10px] overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#1299E8] bg-blue-50 px-2 py-0.5 rounded">
                    Index #{cat.index}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      cat.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 mt-1 truncate">{cat.name}</h3>
                <div className="text-xs text-gray-500 truncate">{cat.bnName}</div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3 line-clamp-2">{cat.desc}</p>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">{cat.productCount} Products</span>
              <button
                type="button"
                onClick={() => handleOpenModal(cat)}
                className="text-[#1299E8] hover:text-[#0e8cd6] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[16px] w-full max-w-lg p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category Name (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category Name (BN)
                  </label>
                  <input
                    type="text"
                    value={bnName}
                    onChange={(e) => setBnName(e.target.value)}
                    className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Image URL
                  </label>
                  <label className="text-[11px] font-semibold text-[#1299E8] hover:underline cursor-pointer flex items-center gap-1">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Hidden')}
                  className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Hidden">Hidden</option>
                </select>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
