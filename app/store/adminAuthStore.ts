import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthState {
  adminToken: string | null;
  hasHydrated: boolean;
  setAdminToken: (token: string) => void;
  clearAdminToken: () => void;
  setHasHydrated: (value: boolean) => void;
}

const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminToken: null,
      hasHydrated: false,
      setAdminToken: (token) => set({ adminToken: token }),
      clearAdminToken: () => set({ adminToken: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "admin-auth-storage",
      // adminToken defaults to null until this resolves, so any redirect
      // logic must wait for hasHydrated before trusting adminToken.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAdminAuthStore;
