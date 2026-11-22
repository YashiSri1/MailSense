# Database Schema

The application uses MongoDB. Below are the primary collections:

## Users
Stores user profile, encrypted passwords, and OAuth tokens.
- `name`, `email`, `password`, `googleId`, `googleTokens`

## Emails
Stores cached emails from the provider and their AI analysis results.
- `providerMessageId`, `sender`, `subject`, `snippet`, `body`
- AI Fields: `category`, `priority`, `intent`, `summary`, `requiresAction`, `requiresResponse`, `action`, `deadline`

## Tasks
Stores tasks created manually or extracted from emails.
- `title`, `description`, `dueDate`, `priority`, `status`, `emailId` (ref)
