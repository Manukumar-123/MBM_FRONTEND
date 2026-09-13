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
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[13px] text-[#8a8a98] mb-1">Content</div>
          <h1 className="font-serif text-[28px] leading-none text-white">Categories & tags</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category"
            className="px-3.5 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[13px] text-white placeholder-[#5f5f6e] outline-none focus:border-cyan-400/40 w-44"
          />
          <button
            type="submit"
            disabled={isAdding}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-[13px] font-medium bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 disabled:opacity-60"
          >
            <Plus size={15} />
            {isAdding ? "Adding…" : "Add"}
          </button>
        </form>
      </div>

      {isLoading ? (
        <p className="text-[#8a8a98] text-sm">Loading…</p>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#111116] p-12 text-center">
          <div className="text-[13.5px] text-[#8a8a98]">
            No categories yet — add your first one above.
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 flex items-center justify-between"
            >
              <span className="text-[14.5px] text-white font-medium">{cat.name}</span>
              <button
                onClick={() => handleDelete(cat._id, cat.name)}
                className="text-[#6f6f7e] hover:text-rose-400 transition-colors"
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
