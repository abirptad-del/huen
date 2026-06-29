import { useState, useEffect, useRef } from "react";
import { Category } from "../types";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "../supabase";
import { useAppContext } from "../context/AppContext";

export const AdminCategories = ({ categories }: { categories: Category[] }) => {
  const { homepageSections, refreshData } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const migrationDone = useRef(false);

  useEffect(() => {
    // Migration logic removed; Homepage Management is the master source for automatic creation, 
    // and Categories creates independent ones (like TOP SELLING).
  }, []);

  const handleSave = async () => {
    try {
      const data = {
        title,
        imageUrl,
        order: categories.length,
        updatedAt: Date.now(),
      };

      if (editingId) {
        // Prevent duplicate
        if (categories.some((c) => c.title.toLowerCase() === title.toLowerCase() && c.id !== editingId)) {
          alert("A category with this name already exists.");
          return;
        }

        const { error } = await supabase
          .from("categories")
          .update(data)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        // Prevent duplicate
        if (categories.some((c) => c.title.toLowerCase() === title.toLowerCase())) {
          alert("A category with this name already exists.");
          return;
        }

        const { error } = await supabase
          .from("categories")
          .insert([{ ...data, createdAt: Date.now() }]);
        if (error) throw error;
      }

      setIsAdding(false);
      setEditingId(null);
      setTitle("");
      setImageUrl("");
      await refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Delete function called with ID:', id);
    try {
      console.log('Sending delete request to Supabase');
      const { error } = await supabase.from("categories").delete().eq("id", id);
      console.log('Delete error:', error);
      if (error) throw error;

      await refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete category");
    }
  };

  const openEdit = (c: Category) => {
    setEditingId(c.id);
    setTitle(c.title || "");
    setImageUrl(c.imageUrl || "");
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Categories
        </h2>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
          className="flex items-center gap-2 bg-[#1a1105] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#241708] transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-lg mb-4">
            {editingId ? "Edit Category" : "New Category"}
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
                Image URL
              </label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
          >
            <div className="h-32 w-full relative">
              <img
                src={cat.imageUrl || undefined}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-[#1a1105]"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    console.log('Delete button clicked', cat);
                    handleDelete(cat.id);
                  }}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900">{cat.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
