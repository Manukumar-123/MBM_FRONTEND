import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import useAdminAuthStore from "../app/store/adminAuthStore";

// Dedicated axios instance for the admin panel — kept independent from the
// user OTP auth flow's axiosInstance/token.
const adminAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

adminAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { adminToken } = useAdminAuthStore.getState();
    if (adminToken && config.headers) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

adminAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const { clearAdminToken } = useAdminAuthStore.getState();
      clearAdminToken();

      if (typeof window !== "undefined" && !window.location.pathname.endsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default adminAxios;
