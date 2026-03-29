"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/authStore";
import { useTaskStore } from "@/hooks/taskStore";
import { Task, TaskFormData } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoutes";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, ClipboardList } from "lucide-react";
import Swal from "sweetalert2";

export default function DashboardPage() {
  const router = useRouter();

  const { user, logout }                          = useAuthStore();
  const { tasks, isLoading, fetchMyTasks,
          createTask, updateTask,
          deleteTask, toggleComplete }             = useTaskStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask]   = useState<Task | null>(null);

  // Fetch tasks once on mount
  useEffect(() => {
    fetchMyTasks().catch(console.error);
  }, [fetchMyTasks]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleSave = async (data: TaskFormData): Promise<void> => {
    if (editTask) {
      await updateTask(editTask.id, data);
      await Swal.fire({
        icon: "success",
        title: "Task updated!",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      await createTask(data);
      await Swal.fire({
        icon: "success",
        title: "Task created!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete this task?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteTask(id);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    await toggleComplete(id, completed);
  };

  const handleLogout = () => {
    return Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        router.push("/login");
      }
    });
  };

  const total    = tasks.length;
  const done     = tasks.filter((t) => t.completed).length;
  const pending  = total - done;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-500">
              <ClipboardList className="w-6 h-6" />
              <h1 className="text-xl font-bold">Task Manager</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Hi, <span className="font-medium">{user?.name}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 bg-red" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total",   value: total,   color: "text-gray-700"   },
              { label: "Pending", value: pending, color: "text-yellow-600" },
              { label: "Done",    value: done,    color: "text-green-600"  },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-white rounded-lg border p-4 text-center shadow-sm"
              >
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">My Tasks</h2>
            <Button onClick={handleOpenCreate} className="flex items-center gap-1 bg-blue-500">
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No tasks yet</p>
              <p className="text-sm">Click &quot;New Task&quot; to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create / Edit modal */}
      <TaskModal
        isOpen={modalOpen}
        editTask={editTask}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </ProtectedRoute>
  );
}
