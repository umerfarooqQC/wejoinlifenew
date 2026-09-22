/**
 * Application In-Memory Token Store.
 * 
 * SECURITY NOTE:
 * Storing the access token in a JavaScript closure/memory variable prevents XSS token theft
 * because it is never saved to localStorage, sessionStorage, or accessible via document.cookie.
 * 
 * When the page refreshes, the token is safely re-acquired by exchanging the HttpOnly cookie
 * at the /auth/me endpoint.
 */

let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

export const clearAccessToken = (): void => {
  inMemoryAccessToken = null;
};
