export const getENV = (key: string): string => {
    if (!process.env[key]) {
        throw new Error(`Missing env variable: ${key}`);
    }
    return process.env[key] as string;
};

export const MONGO_URI = process.env.MONGO_URI || "";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const APP_ORIGIN = process.env.APP_ORIGIN || "";
export const PORT = process.env.PORT || "3000";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";