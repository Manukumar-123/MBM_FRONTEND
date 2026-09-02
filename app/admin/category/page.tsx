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
        (error as AxiosError<{ message?: string }>)?.response?.data
          ?.message || "Failed to add category",
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
        (error as AxiosError<{ message?: string }>)?.response?.data
          ?.message || "Failed to delete category",
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
    if (
      window.confirm(
        `Delete category "${catName}"? This will also delete its subcategories.`,
      )
    ) {
      removeCategory(id);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        Categories
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Add or remove book categories
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Fiction"
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#323232] bg-transparent text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500/50"
        />
        <button
          type="submit"
          disabled={isAdding}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors disabled:opacity-60"
        >
          <Plus size={18} />
          Add
        </button>
      </form>

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No categories yet.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#111]"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                {cat.name}
              </span>
              <button
                onClick={() => handleDelete(cat._id, cat.name)}
                className="text-red-500 hover:text-red-600 transition-colors"
                aria-label={`Delete ${cat.name}`}
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
