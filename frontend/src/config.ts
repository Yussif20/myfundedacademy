const isDev = process.env.NODE_ENV === "development";

export const AppConfig = {
  backendUrl: isDev
    ? process.env.NEXT_PUBLIC_BASE_SERVER_URL_DEV || "http://localhost:5000"
    : process.env.NEXT_PUBLIC_BASE_SERVER_URL || "https://api.myfundedacademy.com",
};

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://myfundedacademy.com";

export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
