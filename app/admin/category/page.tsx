"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { Trash2, Plus } from "lucide-react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  ICategory,
} from "@/api/adminApi";

export default function CategoryPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
  });

  const categories: ICategory[] = data?.data || [];

  const { mutate: addCategory, isPending: isAdding } = useMutation({
    mutationFn: () => createCategory(name.trim()),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Category added");
        setName("");
        queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      } else {
        toast.error(res?.message || "Failed to add category");
      }
    },
    onError: (error) => {
      toast.error(
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
          "Failed to add category",
      );
    },
  });

  const { mutate: removeCategory } = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("Category deleted");
        queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      }
    },
    onError: (error) => {
      toast.error(
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
          "Failed to delete category",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    addCategory();
  };

  const handleDelete = (id: string, catName: string) => {
    if (window.confirm(`Delete category "${catName}"? This will also delete its subcategories.`)) {
      removeCategory(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[13px] text-[#8a8a98] mb-1">Content</div>
          <h1 className="font-serif text-[24px] sm:text-[28px] leading-none text-white">Categories & tags</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category"
            className="px-3.5 py-2 max-md:py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[13px] max-md:text-base text-white placeholder-[#5f5f6e] outline-none focus:border-cyan-400/40 flex-1 min-w-0 sm:flex-none sm:w-44"
          />
          <button
            type="submit"
            disabled={isAdding}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 max-md:py-2.5 rounded-lg text-white text-[13px] font-medium bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 disabled:opacity-60"
          >
            <Plus size={15} />
            {isAdding ? "Adding…" : "Add"}
          </button>
        </form>
      </div>

      {isLoading ? (
        <p className="text-[#8a8a98] text-sm">Loading…</p>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#111116] p-6 sm:p-12 text-center">
          <div className="text-[13.5px] text-[#8a8a98]">
            No categories yet — add your first one above.
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5 flex items-center justify-between gap-3"
            >
              <span className="text-[14.5px] text-white font-medium min-w-0 break-words">{cat.name}</span>
              <button
                onClick={() => handleDelete(cat._id, cat.name)}
                className="text-[#6f6f7e] hover:text-rose-400 transition-colors max-md:shrink-0 max-md:p-2.5 max-md:-m-2.5"
                aria-label={`Delete ${cat.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
