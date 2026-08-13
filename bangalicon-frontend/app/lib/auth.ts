"use client";

import { getPublicApiBase } from "./runtime";

const TOKEN_KEY = "bangalicon_auth_token";
const USER_KEY = "bangalicon_auth_user";
const REMEMBER_KEY = "bangalicon_auth_remember";
const AUTH_EVENT = "bangalicon-auth-changed";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  plan: "free" | "premium";
  billingCycle?: "monthly" | "yearly" | null;
  premiumSince?: string | null;
  premiumExpiresAt?: string | null;
  avatar?: string;
};

const getActiveStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(REMEMBER_KEY) === "0"
    ? window.sessionStorage
    : window.localStorage;
};

const readStorageValue = (key: string) => {
  if (typeof window === "undefined") {
    return "";
  }

  return (
    window.localStorage.getItem(key) ||
    window.sessionStorage.getItem(key) ||
    ""
  );
};

const persistAuth = (token: string, user: AuthUser, rememberMe: boolean, notify: boolean) => {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);

  if (rememberMe) {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.localStorage.setItem(REMEMBER_KEY, "1");
  } else {
    window.sessionStorage.setItem(TOKEN_KEY, token);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    window.localStorage.setItem(REMEMBER_KEY, "0");
  }

  if (notify) {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
};

export const getApiBase = () => getPublicApiBase();
export const startGoogleSignIn = (returnTo = "/", fallbackTo = "/login") => {
  const target = returnTo.startsWith("/") ? returnTo : "/";
  const nextFallback = fallbackTo.startsWith("/") ? fallbackTo : "/login";
  window.location.href = `${getApiBase()}/users/google/start?returnTo=${encodeURIComponent(target)}&fallbackTo=${encodeURIComponent(nextFallback)}`;
};

export const getStoredToken = () =>
  typeof window === "undefined" ? "" : readStorageValue(TOKEN_KEY);

export const getAuthHeaders = () => {
  const token = getStoredToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = readStorageValue(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const storeAuth = (
  token: string,
  user: AuthUser,
  options?: {
    rememberMe?: boolean;
  }
) => {
  persistAuth(token, user, options?.rememberMe !== false, true);
};

export const clearAuth = () => {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(REMEMBER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const refreshStoredUser = async () => {
  const token = getStoredToken();
  const fallbackUser = getStoredUser();

  if (!token) {
    clearAuth();
    return null;
  }

  try {
    const response = await fetch(`${getApiBase()}/users/me`, {
      headers: {
        ...getAuthHeaders(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearAuth();
        return null;
      }

      return fallbackUser;
    }

    const data = await response.json();
    if (!data?.user) {
      return fallbackUser;
    }

    persistAuth(
      token,
      data.user as AuthUser,
      getActiveStorage() !== window.sessionStorage,
      false
    );
    return data.user as AuthUser;
  } catch {
    return fallbackUser;
  }
};

export const onAuthChange = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(AUTH_EVENT, handler as EventListener);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(AUTH_EVENT, handler as EventListener);
  };
};
