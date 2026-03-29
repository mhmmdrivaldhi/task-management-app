import pool from '../lib/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export interface IUser {
    id: number,
    name: string,
    email: string,
    password: string,
    created_at: Date,
    updated_at: Date
}

export interface ILogin {
    email: string,
    password: string
}

export interface IRegister {
    name: string,
    email: string,
    password: string
}

const saltRounds = 10
const signToken = (payload: { id: number; email: string }): string => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
};
  
export const registerUser = async(input: IRegister): Promise<Omit<IUser, "password">> => {
    const name = input.name.trim();
    const email = input.email.trim();
    const password = input.password;

    if(!name || !email || !password) 
        throw { status: 400, message: "name, email, and password are required" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw { status: 400, message: "Invalid email format" };
    if (password.length < 6)
        throw { status: 400, message: "Password must be at least 6 characters" };

    const existing = await pool.query<IUser>(
    "SELECT id FROM users WHERE email = $1",
    [email]
    );

    if (existing.rowCount && existing.rowCount > 0)
      throw { status: 409, message: "Email already registered" };
    const hashed = await bcrypt.hash(password, saltRounds);
    const { rows } = await pool.query<Omit<IUser, "password">>(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at, updated_at`,
    [name, email, hashed]
  );

  if (!rows[0]) {
    throw { status: 500, message: "Failed to register user" };
  }
return rows[0];
};

export const loginUser = async (input: ILogin): Promise<{ token: string; user: Omit<IUser, "password"> }> => {
  const { email, password } = input;
  if (!email || !password)
    throw { status: 400, message: "email and password are required" };
  const { rows } = await pool.query<IUser>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (rows.length === 0)
    throw { status: 401, message: "Invalid credentials" };
  const user = rows[0];
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw { status: 401, message: "Invalid credentials" };
  const token = signToken({ id: user.id, email: user.email });
  const { password: _pw, ...safeUser } = user;
  return { token, user: safeUser };
};

export const getAllUsers = async (): Promise<Omit<IUser, "password">[]> => {
  const { rows } = await pool.query<Omit<IUser, "password">>(
    "SELECT id, name, email, created_at, updated_at FROM users"
  );
  return rows;
};

export const getUserById = async (id: number): Promise<Omit<IUser, "password">> => {
  const { rows } = await pool.query<Omit<IUser, "password">>(
    "SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1",
    [id]
  );
  if (rows.length === 0) throw { status: 404, message: "User not found" };

  if (!rows[0]) {
    throw { status: 500, message: "Failed to retrieve user by id" };
  }
return rows[0];
};

export const updateUser = async (id: number, input: Partial<IRegister>): Promise<Omit<IUser, "password">> => {

  const existingUser = await pool.query<IUser>(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  const user = existingUser.rows[0];
  if (!user) throw { status: 404, message: "User not found" };

  const name = input.name || user.name;
  const email = input.email || user.email;
  let password = user.password;

  if (input.password) {
    if (input.password.length < 6)
      throw { status: 400, message: "Password must be at least 6 characters" };

    password = await bcrypt.hash(input.password, saltRounds);
  }

  if (input.email) {
  const existingEmail = await pool.query(
    "SELECT id FROM users WHERE email = $1 AND id != $2",
    [input.email, id]
  );

  if (existingEmail.rowCount && existingEmail.rowCount > 0) {
    throw { status: 409, message: "Email already in use" };
  }
}

  const { rows } = await pool.query<Omit<IUser, "password">>(
    `UPDATE users
     SET name = $1, email = $2, password = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING id, name, email, created_at, updated_at`,
    [name, email, password, id]
  );

  if (!rows[0]) {
    throw { status: 500, message: "Failed to update user" };
  }

  return rows[0];
};

export const deleteUser = async (id: number): Promise<void> => {
  const { rowCount } = await pool.query(
    "DELETE FROM users WHERE id = $1",
    [id]
  );
  if (!rowCount || rowCount === 0)
    throw { status: 404, message: "User not found" };
};