# Google OAuth Integration

## Flow
1. User clicks "Connect Gmail" on the Frontend.
2. Frontend requests Auth URL from Backend (`GET /api/auth/google`).
3. Backend generates a URL using `googleapis` with `state` containing the User ID, and scopes for `gmail.readonly`.
4. User authenticates on Google and is redirected to `GET /api/auth/google/callback`.
5. Backend exchanges the auth code for access/refresh tokens.
6. Tokens are stored securely in the `User` document.
7. Backend redirects the user back to the Frontend Settings page.
