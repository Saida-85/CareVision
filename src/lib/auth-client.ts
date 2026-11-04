import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include", // Ensures cookies are included in cross-site or API requests
  },
  plugins: [
    jwtClient()
  ]
})