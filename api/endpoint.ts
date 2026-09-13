export const Endpoint = {
  register: "api/auth/register",
  VerifyOtp: "api/auth/verify-otp",
  completeProfile: "api/auth/complete-profile",
  login: "api/auth/login",
  submitBook: "api/books",
  saveDraft: "api/books/draft",
  getBooks: "api/books",
  getBookById: (id: string) => `/api/books/${id}`,
  deleteBook: (id: string) => `/api/books/${id}`,
  updateBook: (id: string) => `/api/books/${id}`,
  creators: "/api/users/creators",
  getAuthorById: (id: string) => `/api/users/${id}`,

  // Creative videos (Pitch Alley / Ask the Universe)
  uploadCreativeVideo: "api/creative-videos",
  getMyCreativeVideos: "api/creative-videos/mine",
  updateCreativeVideo: (id: string) => `/api/creative-videos/${id}`,
  deleteCreativeVideo: (id: string) => `/api/creative-videos/${id}`,
  viewCreativeVideo: (id: string) => `/api/creative-videos/${id}/view`,

  // Admin panel
  adminLogin: "api/admin/auth/login",
  getCategories: "api/categories",
  createCategory: "api/categories",
  deleteCategory: (id: string) => `/api/categories/${id}`,
  getSubcategories: "api/subcategories",
  createSubcategories: "api/subcategories",
  deleteSubcategory: (id: string) => `/api/subcategories/${id}`,
};

