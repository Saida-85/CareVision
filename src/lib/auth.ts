import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Ensure your MONGODB_URI in .env ends with /carevision?retryWrites=true&w=majority
const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const db = client.db("carevision"); // Explicitly targets your 'carevision' database

export const auth = betterAuth({
  database: mongodbAdapter(db),
  
  // 1. Add baseURL explicitly so it works seamlessly on both Localhost and Vercel
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET as string,
    },
  },
});