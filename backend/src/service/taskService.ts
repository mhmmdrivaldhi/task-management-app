import pool from '../lib/db'

export interface ITask {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateTask {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface IUpdateTask {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const createTask = async (input: ICreateTask, userId: number): Promise<ITask> => {
  const { title, description = null, completed = false } = input;
  if (!title || title.trim() === "")
    throw { status: 400, message: "Title is required" };
  const { rows } = await pool.query<ITask>(
    `INSERT INTO tasks (title, description, completed, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title.trim(), description, completed, userId]
  );

  if (!rows[0]) {
    throw { status: 500, message: "Failed to created task" };
  }
  return rows[0];
};

export const getAllTasks = async (): Promise<ITask[]> => {
  const { rows } = await pool.query<ITask>(
    "SELECT * FROM tasks ORDER BY created_at DESC"
  );
  return rows;
};

export const getMyTasks = async (userId: number): Promise<ITask[]> => {
  const { rows } = await pool.query<ITask>(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC", [userId]
  );
  return rows;
};

export const getTaskById = async (id: number): Promise<ITask> => {
  const { rows } = await pool.query<ITask>(
    "SELECT * FROM tasks WHERE id = $1",[id]
  );
  if (rows.length === 0) throw { status: 404, message: "Task not found" };

  if (!rows[0]) {
    throw { status: 500, message: "Failed to retrieve task by id" };
  }
  return rows[0];
};

export const getTasksByUserId = async (userId: number): Promise<ITask[]> => {
  const { rows } = await pool.query<ITask>(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return rows;
};

export const updateTask = async (id: number, input: IUpdateTask, requesterId: number): Promise<ITask> => {
  const task = await getTaskById(id); 
  
  if (task.user_id !== requesterId)
    throw { status: 403, message: "Forbidden: you do not own this task" };
  const title       = input.title       !== undefined ? input.title       : task.title;
  const description = input.description !== undefined ? input.description : task.description;
  const completed   = input.completed   !== undefined ? input.completed   : task.completed;
  const { rows } = await pool.query<ITask>(
    `UPDATE tasks
     SET title = $1, description = $2, completed = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [title, description, completed, id]
  );

  if (!rows[0]) {
    throw { status: 500, message: "Failed to updated task" };
  }
  return rows[0];
};

export const deleteTask = async (id: number,requesterId: number): Promise<void> => {
  const task = await getTaskById(id); 
  if (task.user_id !== requesterId)
    throw { status: 403, message: "Forbidden: you do not own this task" };
  await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
};