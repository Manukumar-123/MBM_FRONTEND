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
};
