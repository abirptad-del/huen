import { useState } from "react";
import { Product } from "../types";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "../supabase";

import { useAppContext } from "../context/AppContext";

export const AdminProducts = ({
  productsTrending,
  productsNew,
}: {
  productsTrending: Product[];
  productsNew: Product[];
}) => {
  const { refreshData, categories, settings } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagesInputList, setImagesInputList] = useState<string[]>([]);
  const [sizesList, setSizesList] = useState<{name: string, stock: number}[]>([{name: "S", stock: 10}, {name: "M", stock: 10}, {name: "L", stock: 10}]);
  const [category, setCategory] = useState("");

  const handleSave = async () => {
    try {
      const data = {
        title,
        price: parseFloat(price) || 0,
        imageUrl,
        categoryId: category || "uncategorized",
        isTrending: true,
        isNew: true,
        sizes: sizesList, // Save as jsonb array of objects
        images: imagesInputList.filter(img => img.trim()), // fix mapping from input list to correct field
        updatedAt: Date.now(),
      };

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(data)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert([{ ...data, createdAt: Date.now() }]);
        if (error) throw error;
      }

      setIsAdding(false);
      setEditingId(null);
      setTitle("");
      setPrice("");
      setImageUrl("");
      setImagesInputList([]);
      setSizesList([{name: "S", stock: 10}, {name: "M", stock: 10}, {name: "L", stock: 10}]);
      setCategory("");
      await refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Delete function called with ID:', id);
    // Removed native confirm() as it is often blocked within the preview iframe sandbox.
    try {
      console.log('Sending delete request to Supabase');
      const { error } = await supabase.from("products").delete().eq("id", id);
      console.log('Delete error:', error);
      if (error) throw error;
      await refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete product");
    }
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setTitle(p.title || "");
    setPrice(p.price?.toString() || "0");
    setImageUrl(p.imageUrl || "");
    setImagesInputList(p.images && p.images.length ? p.images : []);
    
    // Parse sizes
    let parsedSizes = [{name: "S", stock: 10}, {name: "M", stock: 10}, {name: "L", stock: 10}];
    if (p.sizes && Array.isArray(p.sizes) && p.sizes.length > 0) {
      if (typeof p.sizes[0] === 'string') {
        parsedSizes = p.sizes.map((s: any) => {
          try {
            if (typeof s === 'string' && s.startsWith('{')) return JSON.parse(s);
            return { name: s, stock: 10 };
          } catch {
            return { name: s, stock: 10 };
          }
        });
      } else {
        parsedSizes = p.sizes as any;
      }
    }
    setSizesList(parsedSizes);

    setCategory(p.categoryId || "");
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setTitle("");
            setPrice("");
            setImageUrl("");
            setImagesInputList([]);
            setCategory("");
          }}
          className="flex items-center gap-2 bg-[#1a1105] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#241708] transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-lg mb-4">
            {editingId ? "Edit Product" : "New Product"}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (৳)
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Main)
              </label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Images
              </label>
              <div className="space-y-3">
                {imagesInputList.map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      placeholder={`Image ${idx + 2} URL`}
                      value={img}
                      onChange={(e) => {
                        const newList = [...imagesInputList];
                        newList[idx] = e.target.value;
                        setImagesInputList(newList);
                      }}
                      className="w-full px-3 py-2 border rounded"
                    />
                    <button
                      onClick={() => {
                        const newList = [...imagesInputList];
                        newList.splice(idx, 1);
                        setImagesInputList(newList);
                      }}
                      className="px-3 bg-red-50 text-red-600 rounded border border-red-100 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setImagesInputList([...imagesInputList, ""])}
                  className="text-sm font-medium text-[#1a1105] hover:underline"
                >
                  + Add Additional Image
                </button>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sizes & Stock Management
              </label>
              <div className="space-y-3">
                {sizesList.map((sizeObj, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      placeholder="Size Name (e.g. XL)"
                      value={sizeObj.name}
                      onChange={(e) => {
                        const newList = [...sizesList];
                        newList[idx] = { ...newList[idx], name: e.target.value };
                        setSizesList(newList);
                      }}
                      className="w-1/2 px-3 py-2 border rounded"
                    />
                    <input
                      placeholder="Stock quantity"
                      type="number"
                      value={sizeObj.stock}
                      onChange={(e) => {
                        const newList = [...sizesList];
                        newList[idx] = { ...newList[idx], stock: parseInt(e.target.value) || 0 };
                        setSizesList(newList);
                      }}
                      className="w-1/3 px-3 py-2 border rounded"
                    />
                    <button
                      onClick={() => {
                        const newList = [...sizesList];
                        newList.splice(idx, 1);
                        setSizesList(newList);
                      }}
                      className="px-3 bg-red-50 text-red-600 rounded border border-red-100 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setSizesList([...sizesList, { name: "", stock: 0 }])}
                  className="text-sm font-medium text-[#1a1105] hover:underline"
                >
                  + Add Size Variant
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-[#1a1105] text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-800 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Image</th>
              <th className="px-6 py-4 font-semibold">Product Name</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array.from(new Set([...productsTrending, ...productsNew])).map(
              (p: any) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <img
                      src={p.imageUrl || undefined}
                      alt={p.title}
                      className="w-12 h-12 object-cover rounded-md border border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {p.title}
                  </td>
                  <td className="px-6 py-3">৳{p.price?.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 text-gray-500 hover:text-[#1a1105] hover:bg-[#1a1105]/5 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          console.log('Delete button clicked', p);
                          handleDelete(p.id);
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
