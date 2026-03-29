import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "no-jwt-secret-key";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({message: "Authentication Required!"})
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({message: "Invalid Token"})
        return
    }
}  