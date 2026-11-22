# AI Pipeline

MailSense implements an AI Abstraction layer located in `backend/src/services/ai`.

## Flow
1. **Ingestion:** Email data is passed to the AI services.
2. **Classification:** Determines Priority, Category, and Intent.
3. **Extraction:** Extracts boolean flags for required actions/responses, and parses deadlines.
4. **Summarization:** Condenses the body into 1-3 sentences.
5. **Heuristic Scoring:** Calculates a deterministic `priorityScore` from 0-100 based on the AI output (e.g. +15 points for a deadline).

*In Demo Mode, the pipeline uses a fallback heuristic engine to generate deterministic responses without requiring an API key.*
