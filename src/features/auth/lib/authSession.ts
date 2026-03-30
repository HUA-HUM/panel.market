import { AuthUser, LoginPayload, Session } from '@/src/features/auth/types/session';
import {
  clearSessionFromStorage,
  readSessionFromStorage,
  writeSessionToStorage,
} from '@/src/features/auth/lib/sessionStorage';

type SessionListener = (session: Session | null) => void;

let currentSession: Session | null = null;
let refreshPromise: Promise<Session | null> | null = null;
const listeners = new Set<SessionListener>();

function notifySessionChange(session: Session | null) {
  listeners.forEach((listener) => listener(session));
}

function setSession(session: Session | null) {
  currentSession = session;

  if (session) {
    writeSessionToStorage(session);
  } else {
    clearSessionFromStorage();
  }

  notifySessionChange(session);
}

function getStoredSession() {
  if (currentSession) {
    return currentSession;
  }

  const storedSession = readSessionFromStorage();

  if (storedSession) {
    currentSession = storedSession;
  }

  return storedSession;
}

async function parseErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const payload = (await response.json()) as { message?: string; error?: string };
    return payload.message ?? payload.error ?? fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

async function requestAuth<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/auth${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Authentication request failed.'));
  }

  return response.json() as Promise<T>;
}

export function getSessionSnapshot() {
  return getStoredSession();
}

export function subscribeToSession(listener: SessionListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function login(payload: LoginPayload) {
  const session = await requestAuth<Session>('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  setSession(session);
  return session;
}

export async function getCurrentUser(accessToken?: string) {
  const session = getStoredSession();
  const token = accessToken ?? session?.accessToken;

  if (!token) {
    throw new Error('Missing access token.');
  }

  return requestAuth<AuthUser>('/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function refreshSession(): Promise<Session | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const session = getStoredSession();

  if (!session?.refreshToken) {
    setSession(null);
    return null;
  }

  refreshPromise = (async () => {
    try {
      const nextSession = await requestAuth<Session>('/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: session.refreshToken,
        }),
      });

      setSession(nextSession);
      return nextSession;
    } catch {
      setSession(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function initializeSession(): Promise<Session | null> {
  const session = getStoredSession();

  if (!session) {
    return null;
  }

  try {
    const user = await getCurrentUser(session.accessToken);
    const nextSession = {
      ...session,
      user,
    };
    setSession(nextSession);
    return nextSession;
  } catch {
    return refreshSession();
  }
}

export async function logout() {
  const session = getStoredSession();

  try {
    if (session?.accessToken && session.refreshToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          refreshToken: session.refreshToken,
        }),
      });
    }
  } finally {
    setSession(null);
  }
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
  retryOnUnauthorized = true,
): Promise<Response> {
  const session = getStoredSession();
  const headers = new Headers(init?.headers);

  if (session?.accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    cache: init?.cache ?? 'no-store',
  });

  if (response.status !== 401 || !retryOnUnauthorized || !session?.refreshToken) {
    return response;
  }

  const nextSession = await refreshSession();

  if (!nextSession?.accessToken) {
    return response;
  }

  const retryHeaders = new Headers(init?.headers);
  retryHeaders.set('Authorization', `Bearer ${nextSession.accessToken}`);

  return fetch(input, {
    ...init,
    headers: retryHeaders,
    cache: init?.cache ?? 'no-store',
  });
}
