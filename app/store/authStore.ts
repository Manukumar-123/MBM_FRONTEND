import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserDetails {
  _id?: string;
  identifier?: string;
  name?: string;
  dob?: string;
  gender?: string;
  step?: number;
}

interface AuthState {
  accessToken: string | null;
  user: UserDetails | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setUser: (userData: UserDetails) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      // ✅ Save access token
      setAccessToken: (token) => set({ accessToken: token }),

      // ✅ Clear access token
      clearAccessToken: () => set({ accessToken: null }),

      // ✅ Save user details
      setUser: (userData) => set({ user: userData }),

      // ✅ Clear user details
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
