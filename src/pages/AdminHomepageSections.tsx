import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { supabase } from "../supabase";
import { useAppContext } from "../context/AppContext";
import { HomepageSection, HomepageSectionProduct, Product } from "../types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Product Item Component
const SortableProductItem: React.FC<{
  item: { mapping: HomepageSectionProduct; product: Product | undefined };
  onRemove: () => void;
}> = ({ item, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.mapping.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50 mb-2"
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {item.product?.imageUrl && (
          <img
            src={item.product.imageUrl || undefined}
            alt=""
            className="w-10 h-10 object-cover rounded-md"
          />
        )}
        <span className="font-medium text-gray-800 text-sm">
          {item.product?.title || "Unknown Product"}
        </span>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

const SortableSectionItem: React.FC<{
  section: HomepageSection;
  isActiveManage: boolean;
  onManageContent: () => void;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({
  section,
  isActiveManage,
  onManageContent,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: section.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 border rounded-lg flex flex-col gap-2 transition-colors ${
        isActiveManage
          ? "border-[#1a1105] bg-[#1a1105]/5"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="font-bold text-gray-800 text-sm">
            {section.title}
          </span>
          <span
            className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${
              section.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {section.is_active ? "Active" : "Hidden"}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-1 pl-7">
        <button
          onClick={onManageContent}
          className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium text-gray-700"
        >
          Manage Products
        </button>
        <div className="flex gap-2">
          <button
            onClick={onToggleActive}
            className="text-xs hover:underline text-gray-600"
          >
            Toggle
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-500 hover:text-[#1a1105] hover:bg-[#1a1105]/5 rounded"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminHomepageSections = ({
  homepageSections,
  sectionProducts,
  allProducts,
}: {
  homepageSections: HomepageSection[];
  sectionProducts: HomepageSectionProduct[];
  allProducts: Product[];
}) => {
  const { categories, refreshData } = useAppContext();
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // Optimistic UI state for Drag and Drop
  const [localSections, setLocalSections] =
    useState<HomepageSection[]>(homepageSections);

  useEffect(() => {
    setLocalSections(homepageSections);
  }, [homepageSections]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Section Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Assign Products State
  const [managingProductsFor, setManagingProductsFor] = useState<string | null>(
    null,
  );
  const [selectedProductId, setSelectedProductId] = useState("");

  const resetSectionForm = () => {
    setTitle("");
    setSlug("");
    setIsActive(true);
    setIsAddingSection(false);
    setEditingSectionId(null);
  };

  const openEditSection = (section: HomepageSection) => {
    setTitle(section.title || "");
    setSlug(section.slug || "");
    setIsActive(section.is_active);
    setEditingSectionId(section.id);
    setIsAddingSection(true);
  };

  const handleSaveSection = async () => {
    if (!title) return alert("Title is required");
    try {
      const data = {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        is_active: isActive,
      };

      if (editingSectionId) {
        if (homepageSections.some(s => s.title.toLowerCase() === title.toLowerCase() && s.id !== editingSectionId)) {
          alert("A category with this name already exists.");
          return;
        }
        
        const oldTitle = homepageSections.find(s => s.id === editingSectionId)?.title;

        const { error } = await supabase
          .from("homepage_sections")
          .update(data)
          .eq("id", editingSectionId);
        if (error) throw error;

        // Auto-update linked category title
        if (oldTitle) {
          await supabase
            .from("categories")
            .update({ title: title })
            .eq("title", oldTitle);
        }
      } else {
        if (homepageSections.some(s => s.title.toLowerCase() === title.toLowerCase())) {
          alert("A category with this name already exists.");
          return;
        }
        const order = homepageSections.length;
        const { error } = await supabase
          .from("homepage_sections")
          .insert([{ ...data, display_order: order }]);
        if (error) throw error;

        // Auto-create matching category record if it does not exist
        const existingCat = categories.find((c) => c.title.toLowerCase() === title.toLowerCase());
        if (!existingCat) {
          await supabase.from("categories").insert({
            title,
            order: categories.length, // assuming we can just append
            createdAt: Date.now()
          });
        }
      }

      resetSectionForm();
      await refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save section");
    }
  };

  const handleDeleteSection = async (id: string) => {
    try {
      const sectionToDelete = homepageSections.find(s => s.id === id);

      // Manually delete mappings to ensure cleanup
      await supabase
        .from("homepage_section_products")
        .delete()
        .eq("section_id", id);

      const { error } = await supabase
        .from("homepage_sections")
        .delete()
        .eq("id", id);
      if (error) throw error;

      // Auto-delete linked category
      if (sectionToDelete) {
        await supabase
          .from("categories")
          .delete()
          .eq("title", sectionToDelete.title);
      }

      if (managingProductsFor === id) {
        setManagingProductsFor(null);
      }

      await refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete section");
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from("homepage_sections")
        .update({ is_active: !current })
        .eq("id", id);
      if (error) throw error;
      await refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update status");
    }
  };

  const moveSection = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === homepageSections.length - 1)
    )
      return;

    const newSections = [...homepageSections];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    // Swap locally
    const temp = newSections[index];
    newSections[index] = newSections[swapIndex];
    newSections[swapIndex] = temp;

    try {
      // Update DB
      for (let i = 0; i < newSections.length; i++) {
        await supabase
          .from("homepage_sections")
          .update({ display_order: i })
          .eq("id", newSections[i].id);
      }
      await refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to reorder");
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = localSections.findIndex(
        (s) => s.id === (active as any).id,
      );
      const newIndex = localSections.findIndex(
        (s) => s.id === (over as any).id,
      );

      const newOrdered = arrayMove(
        localSections,
        oldIndex,
        newIndex,
      ) as HomepageSection[];
      setLocalSections(newOrdered);

      try {
        for (let i = 0; i < newOrdered.length; i++) {
          await supabase
            .from("homepage_sections")
            .update({ display_order: i })
            .eq("id", newOrdered[i].id);
        }
        await refreshData();
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Failed to save new order");
      }
    }
  };

  const [localMappings, setLocalMappings] = useState<
    { mapping: HomepageSectionProduct; product: Product | undefined }[]
  >([]);

  useEffect(() => {
    if (managingProductsFor) {
      setLocalMappings(getProductsForSection(managingProductsFor));
    } else {
      setLocalMappings([]);
    }
  }, [managingProductsFor, sectionProducts, allProducts]);

  const handleProductDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = localMappings.findIndex(
        (m) => m.mapping.id === (active as any).id,
      );
      const newIndex = localMappings.findIndex(
        (m) => m.mapping.id === (over as any).id,
      );

      const newOrdered = arrayMove(localMappings, oldIndex, newIndex) as {
        mapping: HomepageSectionProduct;
        product: Product | undefined;
      }[];
      setLocalMappings(newOrdered);

      try {
        for (let i = 0; i < newOrdered.length; i++) {
          await supabase
            .from("homepage_section_products")
            .update({ display_order: i })
            .eq("id", newOrdered[i].mapping.id);
        }
        await refreshData();
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Failed to save product order");
      }
    }
  };
  const getProductsForSection = (sectionId: string) => {
    const mappings = sectionProducts
      .filter((sc) => sc.section_id === sectionId)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    return mappings.map((m) => {
      const prod = allProducts.find((p) => p.id === m.product_id);
      return { mapping: m, product: prod };
    });
  };

  const handleAddProductToSection = async (sectionId: string) => {
    if (!selectedProductId) return;

    // Check if mapping exists
    if (
      sectionProducts.find(
        (sc) =>
          sc.section_id === sectionId && sc.product_id === selectedProductId,
      )
    ) {
      return alert("Product already assigned to this section.");
    }

    try {
      const order = sectionProducts.filter(
        (sc) => sc.section_id === sectionId,
      ).length;
      const { error } = await supabase
        .from("homepage_section_products")
        .insert([
          {
            section_id: sectionId,
            product_id: selectedProductId,
            display_order: order,
          },
        ]);
      if (error) throw error;
      setSelectedProductId("");
      await refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to add product");
    }
  };

  const handleRemoveProductFromSection = async (mappingId: string) => {
    try {
      const { error } = await supabase
        .from("homepage_section_products")
        .delete()
        .eq("id", mappingId);
      if (error) throw error;
      await refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to remove product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Category Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage product categories and assign products to them.
          </p>
        </div>
        <button
          onClick={() => {
            resetSectionForm();
            setIsAddingSection(true);
          }}
          className="flex items-center gap-2 bg-[#1a1105] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#241708] transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {isAddingSection && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">
            {editingSectionId ? "Edit Category" : "New Category"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-[#1a1105]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (Optional identifier)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-[#1a1105]"
                placeholder="e.g. top-selling"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                id="isActive"
                className="h-4 w-4 text-[#1a1105] focus:ring-[#1a1105] border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="text-sm text-gray-700 font-medium"
              >
                Active (Display on Homepage)
              </label>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSaveSection}
                className="bg-[#1a1105] text-white px-4 py-2 rounded-md hover:bg-[#241708] transition-colors text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={resetSectionForm}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections List */}
        <div className="lg:col-span-1 border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700">
            Ordered Categories
          </div>
          <div className="p-2 space-y-2 flex-1">
            {localSections.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 italic">
                No categories created.
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localSections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {localSections.map((sec) => (
                    <SortableSectionItem
                      key={sec.id}
                      section={sec}
                      isActiveManage={managingProductsFor === sec.id}
                      onManageContent={() => setManagingProductsFor(sec.id)}
                      onToggleActive={() =>
                        handleToggleActive(sec.id, sec.is_active)
                      }
                      onEdit={() => openEditSection(sec)}
                      onDelete={() => handleDeleteSection(sec.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Products Assignment */}
        <div className="lg:col-span-2 border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
          {managingProductsFor ? (
            <>
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  Assigned Products for "
                  {
                    homepageSections.find((s) => s.id === managingProductsFor)
                      ?.title
                  }
                  "
                </span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  {getProductsForSection(managingProductsFor).length} assigned
                </span>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-6 max-w-sm">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-[#1a1105] text-sm"
                  >
                    <option value="">-- Select Product --</option>
                    {allProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      handleAddProductToSection(managingProductsFor)
                    }
                    disabled={!selectedProductId}
                    className="bg-[#1a1105] text-white px-4 py-2 rounded-md hover:bg-[#241708] transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleProductDragEnd}
                  >
                    <SortableContext
                      items={localMappings.map((m) => m.mapping.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {localMappings.map((item) => (
                        <SortableProductItem
                          key={item.mapping.id}
                          item={item}
                          onRemove={() =>
                            handleRemoveProductFromSection(item.mapping.id)
                          }
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                  {localMappings.length === 0 && (
                    <p className="text-sm text-gray-500 italic py-4">
                      No products assigned yet. Select one above and click Add.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <p>
                Select "Manage Products" on a section to assign products here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
