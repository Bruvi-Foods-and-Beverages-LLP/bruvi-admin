import { z } from "zod";

/**
 * Validated Environment Variables Schema
 * Guarantees compile-time and runtime type safety for critical keys.
 */
const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Bruvi HQ Admin"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3001"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default("https://mock-bruvi.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default("mock-anon-key"),
  BACKEND_API_URL: z.string().url().default("http://localhost:3000/v1"),
  INTERNAL_API_SECRET: z.string().default("dev-secret"),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().default("AIzaSyBB0jvvnQ5YRme4JPOQQwruPFy7IPLCO2g"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parseEnv = () => {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    // In production, throw to prevent unsafe startups
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment configuration");
    }
    // In development, return fallbacks
    return envSchema.parse({});
  }

  return result.data;
};

export const env = parseEnv();

