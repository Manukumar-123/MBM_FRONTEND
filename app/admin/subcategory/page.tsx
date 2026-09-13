"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import {
  getCategories,
  getSubcategories,
  createSubcategories,
  deleteSubcategory,
  ICategory,
  ISubcategory,
} from "@/api/adminApi";
import TagInput from "../components/TagInput";

export default function SubcategoryPage() {
  const queryClient = useQueryClient();
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { data: categoriesRes } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
  });
  const categories: ICategory[] = categoriesRes?.data || [];

  const { data: subcategoriesRes, isLoading } = useQuery({
    queryKey: ["admin-subcategories", categoryId],
    queryFn: () => getSubcategories(categoryId || undefined),
  });
  const subcategories: ISubcategory[] = subcategoriesRes?.data || [];

  const { mutate: addSubcategories, isPending } = useMutation({
    mutationFn: () => createSubcategories(categoryId, tags),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Subcategories added");
        setTags([]);
        queryClient.invalidateQueries({ queryKey: ["admin-subcategories"] });
      } else {
        toast.error(res?.message || "Failed to add subcategories");
      }
    },
    onError: (error) => {
      toast.error(
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
          "Failed to add subcategories",
      );
    },
  });

  const { mutate: removeSubcategory } = useMutation({
    mutationFn: (id: string) => deleteSubcategory(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Subcategory deleted");
        queryClient.invalidateQueries({ queryKey: ["admin-subcategories"] });
      }
    },
    onError: () => toast.error("Failed to delete subcategory"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Please select a category first");
      return;
    }
    if (tags.length === 0) {
      toast.error("Add at least one subcategory tag");
      return;
    }
    addSubcategories();
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <div className="text-[13px] text-[#8a8a98] mb-1">Content</div>
        <h1 className="font-serif text-[28px] leading-none text-white mb-1">Subcategories</h1>
        <p className="text-[13px] text-[#8a8a98] mt-2">
          Select a category, then type a name and press Enter to add it as a tag
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
        <div>
          <label className="block text-[12.5px] text-[#9a9aa8] mb-1.5">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[13.5px] text-white outline-none focus:border-cyan-400/40"
          >
            <option value="" className="bg-[#111116]">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-[#111116]">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[12.5px] text-[#9a9aa8] mb-1.5">Subcategories</label>
          <TagInput
            tags={tags}
            onChange={setTags}
            placeholder="Type a subcategory and press Enter"
            disabled={!categoryId}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 rounded-lg text-white text-[13.5px] font-medium bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save subcategories"}
        </button>
      </form>

      <h2 className="text-[15px] font-medium text-white mb-3">
        {categoryId ? "Subcategories in this category" : "All subcategories"}
      </h2>

      {isLoading ? (
        <p className="text-[#8a8a98] text-sm">Loading…</p>
      ) : subcategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#111116] p-8 text-center">
          <div className="text-[13.5px] text-[#8a8a98]">No subcategories yet.</div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <span
              key={sub._id}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full text-[13px] bg-[#111116] border border-white/[0.08] text-white"
            >
              {sub.name}
              {typeof sub.category === "object" && (
                <span className="text-[11px] text-[#6f6f7e]">({sub.category.name})</span>
              )}
              <button
                onClick={() => removeSubcategory(sub._id)}
                className="text-[#6f6f7e] hover:text-rose-400 transition-colors"
                aria-label={`Delete ${sub.name}`}
              >
                <Trash2 size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
