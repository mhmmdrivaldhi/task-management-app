"use client";

import { useEffect, useState } from "react";
import { Task, TaskFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface TaskModalProps {
  isOpen:    boolean;
  editTask:  Task | null;
  onClose:   () => void;
  onSave:    (data: TaskFormData) => Promise<void>;
}

const DEFAULT_FORM: TaskFormData = {
  title:       "",
  description: "",
  completed:   false,
};

export default function TaskModal({
  isOpen,
  editTask,
  onClose,
  onSave,
}: TaskModalProps) {
  const [form, setForm]       = useState<TaskFormData>(DEFAULT_FORM);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTask) {
      setForm({
        title:       editTask.title,
        description: editTask.description || "",
        completed:   editTask.completed,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setError("");
  }, [editTask, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      setError("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editTask ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Finish the report"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Add more details..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="completed"
              checked={form.completed}
              onCheckedChange={(checked) =>
                setForm({ ...form, completed: Boolean(checked) })
              }
            />
            <Label htmlFor="completed" className="cursor-pointer">
              Mark as completed
            </Label>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
