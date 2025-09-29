import { cookies } from "next/headers";
import { COOKIE_NAMES, COOKIE_CONFIG } from "./cookieConfig";

export async function getApplicationCountFromCookies(): Promise<number> {
  const cookieStore = await cookies();
  const countCookie = cookieStore.get(COOKIE_NAMES.APPLICATION_COUNT);
  return countCookie ? parseInt(countCookie.value, 10) || 0 : 0;
}

export async function setApplicationCountCookie(count: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    COOKIE_NAMES.APPLICATION_COUNT,
    count.toString(),
    COOKIE_CONFIG
  );
}
