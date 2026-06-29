import { useState } from "react";
import { Edit2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { supabase } from "../supabase";
import { useAppContext } from "../context/AppContext";

export const AdminTopCategories = () => {
  const { topCategories, categories, allProducts, refreshData } = useAppContext();

  // Selected Category State
  const [selectedTopCategoryId, setSelectedTopCategoryId] = useState<string | null>(null);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [productsToAssign, setProductsToAssign] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  const resetForm = () => {
    setTitle("");
    setImageUrl("");
    setOrder(0);
    setIsActive(true);
    setProductsToAssign([]);
    setSelectedTopCategoryId(null);
    setIsAdding(false);
  };

  const handleEdit = (tc: any) => {
    setSelectedTopCategoryId(tc.id);
    setTitle(tc.title || "");
    setImageUrl(tc.data?.imageUrl || "");
    setOrder(tc.order || 0);
    setIsActive(tc.isActive);
    setProductsToAssign(tc.data?.productIds || []);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setStatus("Deleting...");
      const { error } = await supabase.from("homepage_content").delete().eq("id", id);
      
      if (error) {
         setStatus("Error deleting: " + error.message);
         alert("Error deleting: " + error.message);
         return;
      }
      
      await refreshData();
      setStatus("Successfully deleted top category.");
      setTimeout(() => setStatus(""), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus("Error deleting: " + err.message);
    }
  };

  const handleSave = async () => {
    if (!title) {
      setStatus("Title is required");
      return;
    }

    try {
      setStatus("Saving...");
      const rowId = selectedTopCategoryId || crypto.randomUUID();
      
      const payload = {
        id: rowId,
        sectionType: "top_category",
        title: title,
        order: order,
        isActive: isActive,
        data: {
          imageUrl,
          productIds: productsToAssign
        },
        updatedAt: Date.now()
      };

      if (!selectedTopCategoryId) {
        Object.assign(payload, { createdAt: Date.now() });
      }

      await supabase.from("homepage_content").upsert(payload);
      
      setStatus("Successfully saved!");
      setTimeout(() => setStatus(""), 3000);
      resetForm();
      await refreshData();
    } catch (err: any) {
      setStatus(err.message || "Failed to save");
    }
  };

  const toggleProduct = (productId: string) => {
    if (productsToAssign.includes(productId)) {
      setProductsToAssign(productsToAssign.filter((id) => id !== productId));
    } else {
      setProductsToAssign([...productsToAssign, productId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Top Categories</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage the large category banners that appear on the homepage.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#1a1105] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#241708] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>
        )}
      </div>

      {status && (
        <div className={`p-4 rounded-lg font-medium text-sm ${status.includes('required') || status.includes('Failed') || status.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {status}
        </div>
      )}

      {isAdding ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="font-bold text-lg text-gray-800">
              {selectedTopCategoryId ? "Edit Top Category" : "Add Top Category"}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#1a1105]"
                placeholder="e.g. LIMITED DROPS"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#1a1105]"
              />
            </div>

            <div className="col-span-2 flex flex-col gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#1a1105] focus:ring-[#1a1105]"
                />
                Active
              </label>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="font-bold text-gray-800 mb-4">Assign Products</h4>
            <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {allProducts.map((p) => {
                const isSelected = productsToAssign.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer mb-1 transition-colors ${
                      isSelected
                        ? "bg-green-50 border border-green-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <img
                        src={p.imageUrl || p.images?.[0] || undefined}
                        alt={p.title}
                        className="w-10 h-12 object-cover rounded shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 leading-tight">
                          {p.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {categories.find((c) => c.id === p.categoryId)?.title || "Uncategorized"}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1a1105] hover:bg-[#241708] rounded-lg transition-colors"
            >
              Save Top Category
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCategories.map((tc) => (
            <div
              key={tc.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{tc.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    tc.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tc.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {tc.data?.productIds?.length || 0} products assigned
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tc)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tc.id)}
                  className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {topCategories.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No top categories defined yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
