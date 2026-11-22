# Security Considerations

1. **Authentication:** Uses secure JWTs for API authentication.
2. **Middleware:** 
   - `helmet` is implemented on the Express app to set secure HTTP headers.
   - `cors` is configured to only allow requests from the designated frontend URL.
3. **Passwords:** Local passwords are encrypted using `bcryptjs` before storage.
4. **OAuth Tokens:** Google OAuth tokens are never exposed to the frontend; they remain in the backend database.
5. **No Password Storage for External Accounts:** The app strictly uses OAuth.
