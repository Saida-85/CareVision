import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
    try {
        const { data, error } = await (authClient as any).jwt.getToken();
        if (error || !data?.token) {
            return null;
        }
        return data.token;
    } catch (err) {
        console.error("Error retrieving client JWT token:", err);
        return null;
    }
};