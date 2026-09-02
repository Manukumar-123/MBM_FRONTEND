import { Endpoint } from "./endpoint";
import axiosInstance from "./intercepter";

export interface IBook {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  author: string;
  coAuthors?: string[];
  language: string;
  pageCount?: number;
  publicationDate?: string;
  isbn?: string;
  edition?: string;
  publisher?: string;
  category: string;
  genreTags?: string[];
  targetAudience?: string;
  customTags?: string[];
  frontCover?: string;
  backCover?: string | null;
  qrCode?: string | null;
  manuscript?: string;
  manuscriptSize?: number;
  samplePdf?: string | null;
  copyrightType?: string;
  copyrightYear?: number;
  copyrightHolder?: string;
  price: number;
  currency?: string;
  allowDownload?: boolean;
  allowPreview?: boolean;
  isExclusive?: boolean;
  preOrderEnabled?: boolean;
  rightsConfirmed?: boolean;
  termsAccepted?: boolean;
  emailOptIn?: boolean;
  status: string;
  rejectionReason?: string | null;
  approvedAt?: string | null;
  viewCount?: number;
  downloadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  pagination?: IPagination;
}

export interface IBookListParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
  author?: string;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: string;
}

export interface IPublicAuthor {
  _id: string;
  name?: string;
  role?: string;
  gender?: string;
  createdAt: string;
  bookCount: number;
}

export interface IAuthorProfile {
  user: IPublicAuthor;
  books: IBook[];
  bookCount: number;
}


export interface ICreator {
  _id: string;
  name?: string;
  role?: string;
  gender?: string;
  createdAt: string;
  bookCount: number;
}

export interface ICreatorPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ICreatorListResponse {
  success: boolean;
  message: string;
  data: ICreator[];
  pagination: ICreatorPagination;
}

/* =====================================================
   AUTHENTICATION APIs
===================================================== */

export interface IVerifyOtpUser {
  _id: string;
  identifier: string;
  name?: string;
  dob?: string;
  gender?: string;
  role?: "user" | "author" | "writer";
  step: number;
}

export interface IVerifyOtpResponse {
  success: boolean;
  message: string;
  step: number;
  data?: {
    token: string;
    user: IVerifyOtpUser;
  };
}

export const register = async (payload: unknown) => {
  const { data } = await axiosInstance.post(Endpoint.register, payload);
  return data;
};

export const verifyOtp = async (
  identifier: string,
  otp: string,
): Promise<IVerifyOtpResponse> => {
  const { data } = await axiosInstance.post(Endpoint.VerifyOtp, {
    identifier,
    otp,
  });
  return data;
};

export const completeProfile = async (profileData: unknown) => {
  const { data } = await axiosInstance.post(
    Endpoint.completeProfile,
    profileData,
  );
  return data;
};

export const login = async (payload: unknown) => {
  const { data } = await axiosInstance.post(Endpoint.login, payload);
  return data;
};

/* =====================================================
   BOOK APIs
===================================================== */

export const submitBook = async (
  formData: FormData,
  onProgress?: (progress: number) => void,
) => {
  const { data } = await axiosInstance.post(Endpoint.submitBook, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });

  return data;
};

export const saveDraft = async (formData: FormData) => {
  const { data } = await axiosInstance.post(Endpoint.saveDraft, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const getBooks = async (params?: Record<string, string>) => {
  const { data } = await axiosInstance.get(Endpoint.getBooks, { params });
  return data;
};

export const getBookById = async (id: string) => {
  const { data } = await axiosInstance.get(Endpoint.getBookById(id));
  return data;
};

export const deleteBook = async (id: string) => {
  const { data } = await axiosInstance.delete(Endpoint.deleteBook(id));
  return data;
};

export const updateBook = async (
  id: string,
  formData: FormData,
  onProgress?: (progress: number) => void,
) => {
  const { data } = await axiosInstance.put(Endpoint.updateBook(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return data;
};


/* =====================================================
   CREATOR APIs
===================================================== */

export const getCreators = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<ICreatorListResponse> => {
  const { data } = await axiosInstance.get("api/users/creators", {
    params,
  });

  return data;
};

export const getAuthorById = async (
  id: string,
): Promise<{ success: boolean; message: string; data: IAuthorProfile }> => {
  const { data } = await axiosInstance.get(Endpoint.getAuthorById(id));
  return data;
};
/* =====================================================
   FILE URL HELPER
===================================================== */

export const getFileUrl = (path?: string | null) => {
  if (!path) return null;

  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace("/", "") ||
    "http://localhost:4000";

  return `${base}${path}`;
};
