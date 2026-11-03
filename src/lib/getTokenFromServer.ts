import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenFromServer = async () => {
    try {
        const jwtToken = await auth.api.getToken({
            headers: await headers(),
        });
        return jwtToken?.token || null;
    } catch (error) {
        console.error("Error fetching server-side token:", error);
        return null;
    }
};