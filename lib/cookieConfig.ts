export const COOKIE_NAMES = {
  APPLICATION_COUNT: "applications_count",
} as const;

export const COOKIE_CONFIG = {
  maxAge: 60 * 60 * 24 * 30,
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
} as const;
