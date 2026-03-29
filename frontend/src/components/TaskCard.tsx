"use client";

import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Pencil, Trash2 } from "lucide-react";

interface TaskCardProps {
  task:           Task;
  onEdit:         (task: Task) => void;
  onDelete:       (id: number) => void;
  onToggle:       (id: number, completed: boolean) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggle,
}: TaskCardProps) {
  return (
    <Card className={`transition-all ${task.completed ? "opacity-70" : ""}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle
          className={`text-base font-semibold leading-tight ${
            task.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.title}
        </CardTitle>

        <Badge variant={task.completed ? "secondary" : "default"}>
          {task.completed ? "Done" : "Pending"}
        </Badge>
      </CardHeader>

      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {task.description}
          </p>
        )}

        <p className="text-xs text-muted-foreground mb-4">
          Created:{" "}
          {new Date(task.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggle(task.id, task.completed)}
            className="flex items-center gap-1"
          >
            {task.completed ? (
              <Circle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {task.completed ? "Undo" : "Complete"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            className="flex items-center gap-1"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
