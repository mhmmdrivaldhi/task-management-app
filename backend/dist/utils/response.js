"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = exports.errorResponse = void 0;
const errorResponse = (statusCode, message, error) => {
    if (error != null && error instanceof Error) {
        const response = {
            statusCode: statusCode,
            message: message != null ? message : error.message,
            error: error.message
        };
        return response;
    }
    const response = {
        statusCode: 500,
        message: "Internal Server Error",
        error: error
    };
    return response;
};
exports.errorResponse = errorResponse;
const successResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
//# sourceMappingURL=response.js.map