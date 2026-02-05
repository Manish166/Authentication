const getENV = (key: string): string => {
    if (!process.env[key]) {
        throw new Error(`Missing env variable: ${key}`);
    }
    return process.env[key] as string;
};

export const MONGO_URI = getENV("MONGO_URI");

export const NODE_ENV = getENV("NODE_ENV");
export const PORT = (getENV("PORT"));
export const JWT_SECRET = getENV("JWT_SECRET");
export const JWT_REFRESH_SECRET = getENV("JWT_REFRESH_SECRET");