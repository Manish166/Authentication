import  { getENV } from '../../constants/env.js';
// Mock process.env
const originalEnv = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
});

afterEach(() => {
    process.env = originalEnv;
});

describe('Environment Variables - getENV', () => {
    it('should return the environment variable value when it exists', () => {
        process.env.TEST_VAR = 'test_value';
        const result = getENV('TEST_VAR');
        expect(result).toBe('test_value');
    });

    it('should throw an error when environment variable is missing', () => {
        delete process.env.MISSING_VAR;
        expect(() => {
            getENV('MISSING_VAR');
        }).toThrow('Missing env variable: MISSING_VAR');
    });

    it('should throw an error when environment variable is undefined', () => {
        process.env.UNDEFINED_VAR = undefined as any;
        expect(() => {
            getENV('UNDEFINED_VAR');
        }).toThrow('Missing env variable: UNDEFINED_VAR');
    });

    it('should throw an error when environment variable is empty string', () => {
        process.env.EMPTY_VAR = '';
        expect(() => {
            getENV('EMPTY_VAR');
        }).toThrow('Missing env variable: EMPTY_VAR');
    });

    it('should return the correct value for multiple different variables', () => {
        process.env.VAR1 = 'value1';
        process.env.VAR2 = 'value2';
        
        expect(getENV('VAR1')).toBe('value1');
        expect(getENV('VAR2')).toBe('value2');
    });

    it('should return string values with special characters', () => {
        process.env.SPECIAL_VAR = 'value-with_special.chars@123';
        expect(getENV('SPECIAL_VAR')).toBe('value-with_special.chars@123');
    });
});
