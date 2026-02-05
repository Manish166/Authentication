import { type ErrorRequestHandler } from "express";
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        status: statusCode,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    })
}