import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Ensure your MONGODB_URI in .env ends with /carevision?retryWrites=true&w=majority
const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const db = client.db("carevision"); // Explicitly targets your 'carevision' database

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});