import { COOKIE_NAMES, COOKIE_CONFIG } from "./cookieConfig";

export function getClientApplicationCount(): number {
  if (typeof document === "undefined") return 0;

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAMES.APPLICATION_COUNT}=`))
    ?.split("=")[1];

  return value ? parseInt(value, 10) || 0 : 0;
}

export function setClientApplicationCount(count: number): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + COOKIE_CONFIG.maxAge * 1000);

  document.cookie = `${
    COOKIE_NAMES.APPLICATION_COUNT
  }=${count}; expires=${expires.toUTCString()}; path=/; SameSite=${
    COOKIE_CONFIG.sameSite
  }`;
}
