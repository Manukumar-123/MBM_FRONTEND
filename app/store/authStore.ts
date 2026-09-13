import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserDetails {
  _id?: string;
  identifier?: string;
  name?: string;
  dob?: string;
  gender?: string;
  role?: "user" | "author" | "writer";
  step?: number;
}

interface AuthState {
  accessToken: string | null;
  user: UserDetails | null;
  hasHydrated: boolean;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setUser: (userData: UserDetails) => void;
  clearUser: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,

      // ✅ Save access token
      setAccessToken: (token) => set({ accessToken: token }),

      // ✅ Clear access token
      clearAccessToken: () => set({ accessToken: null }),

      // ✅ Save user details
      setUser: (userData) => set({ user: userData }),

      // ✅ Clear user details
      clearUser: () => set({ user: null }),

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      // Reading from localStorage is async — pages must wait for this before trusting accessToken/user.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);


export default useAuthStore;
