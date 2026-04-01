import mongoose from 'mongoose';

// Mock mongoose before any imports
jest.mock('mongoose');

const mockedMongoose = mongoose as jest.Mocked<typeof mongoose>;

describe.skip('Database Connection - connectToDB', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation();
        // Clear module cache to allow re-importing with mocks
        jest.resetModules();
    });

    afterEach(() => {
        (console.log as jest.Mock).mockRestore();
    });

    it('should successfully connect to MongoDB', async () => {
        mockedMongoose.connect.mockResolvedValueOnce({} as any);
        
        // Dynamically import after mocks are set up
        const connectToDB = (await import('../../config/db.js')).default;

        await connectToDB();

        expect(mockedMongoose.connect).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('connected to DB');
    });

    it('should call mongoose.connect', async () => {
        mockedMongoose.connect.mockResolvedValueOnce({} as any);
        
        const connectToDB = (await import('../../config/db.js')).default;

        await connectToDB();

        expect(mockedMongoose.connect).toHaveBeenCalledTimes(1);
    });

    it('should handle connection errors and exit the process', async () => {
        const connectionError = new Error('Connection failed');
        mockedMongoose.connect.mockRejectedValueOnce(connectionError);
        
        const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
        
        const connectToDB = (await import('../../config/db.js')).default;
        await connectToDB();

        expect(console.log).toHaveBeenCalledWith('Could not connect to DB', connectionError);
        expect(exitSpy).toHaveBeenCalledWith(1);
        
        exitSpy.mockRestore();
    });

    it('should handle network errors during connection', async () => {
        const networkError = new Error('Network timeout');
        mockedMongoose.connect.mockRejectedValueOnce(networkError);
        
        const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
        
        const connectToDB = (await import('../../config/db.js')).default;
        await connectToDB();

        expect(console.log).toHaveBeenCalledWith('Could not connect to DB', networkError);
        expect(exitSpy).toHaveBeenCalledWith(1);
        
        exitSpy.mockRestore();
    });

    it('should handle invalid MONGO_URI format', async () => {
        const invalidURIError = new Error('Invalid MongoDB URI');
        mockedMongoose.connect.mockRejectedValueOnce(invalidURIError);
        
        const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
        
        const connectToDB = (await import('../../config/db.js')).default;
        await connectToDB();

        expect(exitSpy).toHaveBeenCalledWith(1);
        
        exitSpy.mockRestore();
    });
});
