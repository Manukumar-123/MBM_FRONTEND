import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthState {
  adminToken: string | null;
  setAdminToken: (token: string) => void;
  clearAdminToken: () => void;
}

const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminToken: null,
      setAdminToken: (token) => set({ adminToken: token }),
      clearAdminToken: () => set({ adminToken: null }),
    }),
    {
      name: "admin-auth-storage",
    }
  )
);

export default useAdminAuthStore;
