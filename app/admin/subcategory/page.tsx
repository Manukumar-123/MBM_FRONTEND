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
        (error as AxiosError<{ message?: string }>)?.response?.data
          ?.message || "Failed to add subcategories",
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        Subcategories
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Select a category, then type a name and press Enter to add it as a tag
      </p>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#323232] bg-white dark:bg-transparent text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500/50"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subcategories
          </label>
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
          className="px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Subcategories"}
        </button>
      </form>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {categoryId ? "Subcategories in this category" : "All subcategories"}
      </h2>

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : subcategories.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No subcategories yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {subcategories.map((sub) => (
            <li
              key={sub._id}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#111]"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                {sub.name}
                {typeof sub.category === "object" && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    ({sub.category.name})
                  </span>
                )}
              </span>
              <button
                onClick={() => removeSubcategory(sub._id)}
                className="text-red-500 hover:text-red-600 transition-colors"
                aria-label={`Delete ${sub.name}`}
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
