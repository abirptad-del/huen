import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Upload,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { AdminProduct, AdminCategory } from '../adminStore';
import { navigateAdmin } from '../adminRouting';
import { uploadImageToSupabase } from '../../lib/supabaseService';

interface ProductFormPageProps {
  productId?: string;
  categories: AdminCategory[];
  products: AdminProduct[];
  onSaveProduct: (product: AdminProduct) => void;
}

export const ProductFormPage: React.FC<ProductFormPageProps> = ({
  productId,
  categories,
  products,
  onSaveProduct,
}) => {
  const isEditing = Boolean(productId && productId !== 'new');
  const existingProduct = products.find((p) => p.id === productId);

  const [name, setName] = useState(existingProduct?.name || '');
  const [bnName, setBnName] = useState(existingProduct?.bnName || '');
  const [desc, setDesc] = useState(existingProduct?.desc || '');
  const [bnDesc, setBnDesc] = useState(existingProduct?.bnDesc || '');
  const [price, setPrice] = useState(existingProduct?.price?.toString() || '');
  const [oldPrice, setOldPrice] = useState(existingProduct?.oldPrice?.toString() || '');
  const [categoryIndex, setCategoryIndex] = useState(existingProduct?.categoryIndex || 0);
  const [stock, setStock] = useState(existingProduct?.stock?.toString() || '25');
  const [sku, setSku] = useState(existingProduct?.sku || `HNV-${Math.floor(100 + Math.random() * 900)}`);
  const [image, setImage] = useState(
    existingProduct?.image ||
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80'
  );
  const [status, setStatus] = useState<AdminProduct['status']>(existingProduct?.status || 'Published');
  const [isPopular, setIsPopular] = useState<boolean>(existingProduct ? Boolean(existingProduct.isPopular) : false);
  const [isNewest, setIsNewest] = useState<boolean>(existingProduct ? Boolean(existingProduct.isNewest) : true);
  const [features, setFeatures] = useState<string[]>(
    existingProduct?.features || ['High durability build', 'Premium smart functionality', '1 Year Warranty']
  );
  const [newFeature, setNewFeature] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase('product-images', file);
      if (publicUrl) {
        setImage(publicUrl);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = categories.find((c) => c.index === Number(categoryIndex)) || categories[0];

    const productPayload: AdminProduct = {
      id: isEditing && existingProduct ? existingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      bnName: bnName.trim(),
      desc: desc.trim(),
      bnDesc: bnDesc.trim(),
      price: Number(price) || 0,
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      categoryIndex: Number(categoryIndex),
      categoryName: category.name,
      stock: Number(stock) || 0,
      sku: sku.trim(),
      image: image.trim(),
      status,
      isPopular,
      isNewest,
      features,
      specs: existingProduct?.specs || { Warranty: '1 Year', Origin: 'Official Import' },
      createdAt: existingProduct?.createdAt || new Date().toISOString(),
    };

    onSaveProduct(productPayload);
    setSavedSuccess(true);
    setTimeout(() => {
      navigateAdmin('/products');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateAdmin('/products')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {isEditing ? `Edit Product: ${existingProduct?.name || ''}` : 'Add New Product'}
            </h1>
            <p className="text-xs text-gray-500">
              {isEditing ? 'Update item information, price, and specs' : 'Fill details to publish a new product to storefront'}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Product saved successfully!</span>
          </div>
        )}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAIN COLUMN (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <div className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Portable Mini Air Cooler"
                    className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Product Title (Bengali)
                  </label>
                  <input
                    type="text"
                    value={bnName}
                    onChange={(e) => setBnName(e.target.value)}
                    placeholder="e.g. পোর্টেবল মিনি এয়ার কুলার"
                    className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Short Description (English) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Key highlight for product cards..."
                  className="w-full p-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Short Description (Bengali)
                </label>
                <textarea
                  rows={2}
                  value={bnDesc}
                  onChange={(e) => setBnDesc(e.target.value)}
                  placeholder="বাংলা ডেসক্রিপশন..."
                  className="w-full p-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none resize-none"
                />
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5">
                Pricing & Inventory
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Selling Price (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="850"
                    className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Original / Cut Price (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="1100"
                    className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="25"
                    className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  SKU / Item Code *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="HNV-GADGET-01"
                  className="w-full sm:w-1/2 h-[40px] px-3 bg-gray-50 text-xs sm:text-sm font-mono text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Product Key Features */}
            <div className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5">
                Key Bullet Points / Features
              </h2>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a key feature (e.g. Type-C Fast Charging)..."
                  className="flex-1 h-[38px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="h-[38px] px-3.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-[8px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-2 pt-1">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-[8px] bg-gray-50 border border-gray-200/60 text-xs text-gray-800"
                  >
                    <span>&bull; {feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDE COLUMN (1 col) */}
          <div className="space-y-6">
            {/* Category & Status */}
            <div className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5">
                Organization & Visibility
              </h2>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={categoryIndex}
                  onChange={(e) => setCategoryIndex(Number(e.target.value))}
                  className="w-full h-[40px] px-3 bg-gray-50 text-xs text-gray-800 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.index}>
                      {c.name} ({c.bnName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Publishing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AdminProduct['status'])}
                  className="w-full h-[40px] px-3 bg-gray-50 text-xs text-gray-800 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none cursor-pointer"
                >
                  <option value="Published">Published (Visible in Store)</option>
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1299E8] focus:ring-[#1299E8] border-gray-300"
                  />
                  <span className="text-xs text-gray-700 font-medium">Feature in Trending Finds</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewest}
                    onChange={(e) => setIsNewest(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1299E8] focus:ring-[#1299E8] border-gray-300"
                  />
                  <span className="text-xs text-gray-700 font-medium">Mark as New Arrival</span>
                </label>
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5">
                Product Image
              </h2>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Image URL / Asset Link *
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
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] focus:bg-white outline-none"
                />
              </div>

              {/* Preview */}
              <div className="mt-2">
                <div className="text-xs font-semibold text-gray-500 mb-1.5">Live Preview:</div>
                <div className="w-full h-[180px] bg-gray-50 rounded-[10px] border border-gray-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={image}
                    alt="Preview"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-[14px] p-5 border border-gray-200/70 shadow-xs space-y-2">
              <button
                type="submit"
                className="w-full h-[44px] bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-xs sm:text-sm font-semibold rounded-[10px] flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigateAdmin('/products')}
                className="w-full h-[40px] bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-[10px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
