"use client";

export const ADMIN_TOKEN_KEY = "krishi_mitra_admin_token";
export const ADMIN_USER_KEY = "krishi_mitra_admin";
export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_SESSION_EXPIRED_EVENT = "krishi-mitra:admin-session-expired";

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function expireAdminSession() {
  if (typeof window === "undefined") return;
  const hadSession =
    Boolean(localStorage.getItem(ADMIN_TOKEN_KEY)) ||
    Boolean(localStorage.getItem(ADMIN_USER_KEY));
  clearAdminSession();
  if (hadSession) {
    window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
  }
}