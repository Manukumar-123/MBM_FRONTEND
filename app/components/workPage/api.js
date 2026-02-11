import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
});

/**
 * Submit a new book for review
 * @param {FormData} formData - multipart form data with all fields + files
 * @param {function} onProgress - optional progress callback (0–100)
 */
export async function submitBook(formData, onProgress) {
  const response = await api.post("/books", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return response.data;
}

/**
 * Save book as draft (no required-field validation)
 */
export async function saveDraft(formData) {
  const response = await api.post("/books/draft", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * Get paginated book list
 */
export async function getBooks(params = {}) {
  const response = await api.get("/books", { params });
  return response.data;
}

/**
 * Get single book by ID
 */
export async function getBookById(id) {
  const response = await api.get(`/books/${id}`);
  return response.data;
}

/**
 * Delete a book by ID
 */
export async function deleteBook(id) {
  const response = await api.delete(`/books/${id}`);
  return response.data;
}

/**
 * Build full file URL from relative path
 */
export function getFileUrl(path) {
  if (!path) return null;
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:5000";
  return `${base}${path}`;
}

export default api;
