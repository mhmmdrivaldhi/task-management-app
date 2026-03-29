import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import api from "@/lib/axios";
import { ApiResponse, LoginResponse } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post<ApiResponse<LoginResponse>>(
            "/users/login",
            { email, password }
          );

          const { token, user } = data.data;

          set({ 
            token: token,
            user: user,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw new Error("Login failed");
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          await api.post<ApiResponse<User>>("/users", {
            name,
            email,
            password,
          });

          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw new Error("Registration failed");
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);