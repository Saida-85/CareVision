import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
    try {
        // Fetch the JWT token from Better Auth's client plugin endpoint
        const { data, error } = await authClient.getSession();
        
        if (error || !data) {
            return null;
        }

        // Request a token exchange or fetch token via authClient plugin if available
        const tokenRes = await (authClient as any).jwt?.getToken?.();
        return tokenRes?.data?.token || null;
    } catch (err) {
        console.error("Error retrieving client JWT token:", err);
        return null;
    }
};