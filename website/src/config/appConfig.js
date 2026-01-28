// website/src/config/appConfig.js

  export const APP_BASE_PATH = process.env.NEXT_PUBLIC_APP_PATH || "/app";

export const API_BASE_PATH =
  process.env.NEXT_PUBLIC_API_PATH || "/api";

  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_APP_PATH) {
  console.warn('NEXT_PUBLIC_APP_PATH not set, using default /app');
}