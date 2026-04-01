import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middleware/errorHandler';

describe('Error Handler Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    let statusSpy;
    let jsonSpy;

    beforeEach(() => {
        statusSpy = jest.fn().mockReturnThis();
        jsonSpy = jest.fn().mockReturnThis();

        mockReq = {};
        mockRes = {
            status: statusSpy,
            json: jsonSpy
        };
        mockNext = jest.fn();
        
        jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        (console.log as jest.Mock).mockRestore();
    });

    it('should return status 500 with error message when no statusCode is provided', () => {
        const error = new Error('Test error');
        
        errorHandler(error as any, mockReq as any, mockRes as any, mockNext);

        expect(statusSpy).toHaveBeenCalledWith(500);
        expect(jsonSpy).toHaveBeenCalledWith({
            status: 500,
            message: 'Test error',
            stack: undefined
        });
    });

    it('should return custom statusCode from error object', () => {
        const error = new Error('Bad request');
        (error as any).statusCode = 400;
        
        errorHandler(error as any, mockReq as any, mockRes as any, mockNext);

        expect(statusSpy).toHaveBeenCalledWith(400);
        expect(jsonSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 400,
                message: 'Bad request'
            })
        );
    });

    it('should include stack trace in development mode', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        
        const error = new Error('Dev error');
        (error as any).statusCode = 500;
        
        errorHandler(error as any, mockReq as any, mockRes as any, mockNext);

        expect(jsonSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                stack: expect.any(String)
            })
        );

        process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production mode', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        
        const error = new Error('Prod error');
        (error as any).statusCode = 500;
        
        errorHandler(error as any, mockReq as any, mockRes as any, mockNext);

        expect(jsonSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                stack: undefined
            })
        );

        process.env.NODE_ENV = originalEnv;
    });

    it('should use default message "Internal Server Error" when error.message is missing', () => {
        const error = { statusCode: 500 };
        
        errorHandler(error as any, mockReq as any, mockRes as any, mockNext);

        expect(jsonSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Internal Server Error'
            })
        );
    });

    it('should handle errors with 404 status code', () => {
        const error = new Error('Not found');
        (error as any).statusCode = 404;
        
        errorHandler(error as any, mockReq as any, mockRes as any, mockNext);

        expect(statusSpy).toHaveBeenCalledWith(404);
        expect(jsonSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 404,
                message: 'Not found'
            })
        );
    });

    it('should handle errors with 401 status code', () => {
        const error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        
        errorHandler(error as any, mockReq as any, mockRes as any, mockNext);

        expect(statusSpy).toHaveBeenCalledWith(401);
    });

    it('should log the error to console', () => {
        const error = new Error('Test error');
        const consoleSpy = console.log as jest.Mock;
        
        errorHandler(error as any, mockReq as any, mockRes as any, mockNext);

        expect(consoleSpy).toHaveBeenCalledWith(error);
    });
});
