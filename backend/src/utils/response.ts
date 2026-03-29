import { Response } from "express";

export const errorResponse = (statusCode: number, message: string | null, error: any | null) => {
    if(error != null && error instanceof Error) {
        const response = {
            statusCode: statusCode,
            message: message != null ? message : error.message,
            error: error.message
        }
        return response;
    }
    const response = {
        statusCode: 500,
        message: "Internal Server Error",
        error: error
    }
    return response
}

export const successResponse = (res: Response, statusCode: number, message: string, data: any) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};