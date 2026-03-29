import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, TaskFormData, ApiResponse } from "@/types";
import api from "@/lib/axios";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;

  fetchMyTasks: () => Promise<void>;
  createTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: number, data: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleComplete: (id: number, completed: boolean) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,

      fetchMyTasks: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get<ApiResponse<Task[]>>(
            "/tasks/my-tasks"
          );
          set({ tasks: data.data, isLoading: false });
        } catch {
          set({ isLoading: false });
          throw new Error("Failed to fetch tasks");
        }
      },

      createTask: async (formData) => {
        const { data } = await api.post<ApiResponse<Task>>(
          "/tasks",
          formData
        );
        set({ tasks: [data.data, ...get().tasks] });
      },

      updateTask: async (id, formData) => {
        const { data } = await api.put<ApiResponse<Task>>(
          `/tasks/${id}`,
          formData
        );
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? data.data : t
          ),
        });
      },

      deleteTask: async (id) => {
        await api.delete(`/tasks/${id}`);
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
      },

      toggleComplete: async (id, completed) => {
        const { data } = await api.put<ApiResponse<Task>>(
          `/tasks/${id}`,
          { completed: !completed }
        );
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? data.data : t
          ),
        });
      },
    }),
    {
      name: "task-storage",

      partialize: (state) => ({
        tasks: state.tasks,
      }),
    }
  )
);