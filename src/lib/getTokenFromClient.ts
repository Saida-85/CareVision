import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
    try {
        // 1. Get the currently logged-in user session from Better Auth
        const session = await authClient.getSession();
        const user = session?.data?.user;

        if (!user?.email) {
            console.warn("No active user session found.");
            return null;
        }

        // 2. Request a JWT token from your Express backend's /jwt route
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        
        const res = await fetch(`${API_URL}/jwt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
        });

        if (!res.ok) {
            throw new Error("Failed to issue token from backend.");
        }

        const data = await res.json();
        return data.token || null;
    } catch (err) {
        console.error("Error retrieving client JWT token:", err);
        return null;
    }
};