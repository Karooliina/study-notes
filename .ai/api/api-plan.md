# REST API Plan

## 1. Resources

- **Users**: Corresponds to the `users` table managed by Supabase Auth
- **Notes**: Corresponds to the `notes` table for storing user notes (AI-generated or manual)

## 2. Endpoints

### Notes

**List Notes**

- Method: `GET`
- Path: `/notes`
- Description: Get paginated list of user's notes
- Headers: Authorization: Bearer {access_token}
- Query Parameters:
  - `order`: Sort order ('asc' or 'desc', default: 'desc')
- Response Body:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "Note Title",
        "content": "Note content text",
        "source": "AI|Manual",
        "created_at": "2023-05-10T14:30:00Z",
        "updated_at": "2023-05-10T14:30:00Z"
      }
    ]
  }
  ```
- Success: 200 OK
- Errors:
  - 401 Unauthorized
  - 400 Bad Request (Invalid query parameters)

**Get Note Details**

- Method: `GET`
- Path: `/notes/{noteId}`
- Description: Get details of a specific note
- Headers: Authorization: Bearer {access_token}
- Response Body:
  ```json
  {
    "id": "uuid",
    "title": "Note Title",
    "content": "Note content text",
    "source_text": "Original source text (only for AI notes)",
    "source": "AI|Manual",
    "created_at": "2023-05-10T14:30:00Z",
    "updated_at": "2023-05-10T14:30:00Z"
  }
  ```
- Success: 200 OK
- Errors:
  - 401 Unauthorized
  - 403 Forbidden (Not user's note)
  - 404 Not Found

**Create Note**

- Method: `POST`
- Path: `/notes`
- Description: Create a new note (manual or save AI-generated)
- Headers: Authorization: Bearer {access_token}
- Request Body:
  ```json
  {
    "title": "Note Title",
    "content": "Note content text",
    "source_text": "Original source text (only for AI notes)",
    "source": "AI|Manual"
  }
  ```
- Response Body:
  ```json
  {
    "id": "uuid",
    "title": "Note Title",
    "content": "Note content text",
    "source_text": "Original source text (only for AI notes)",
    "source": "AI|Manual",
    "created_at": "2023-05-10T14:30:00Z",
    "updated_at": "2023-05-10T14:30:00Z"
  }
  ```
- Success: 201 Created
- Errors:
  - 400 Bad Request (Validation errors)
  - 401 Unauthorized

**Update Note**

- Method: `PATCH`
- Path: `/notes/{noteId}`
- Description: Update an existing note
- Headers: Authorization: Bearer {access_token}
- Request Body:
  ```json
  {
    "title": "Updated Note Title",
    "content": "Updated note content text"
  }
  ```
- Response Body:
  ```json
  {
    "id": "uuid",
    "title": "Updated Note Title",
    "content": "Updated note content text",
    "source_text": "Original source text (only for AI notes)",
    "source": "AI|Manual",
    "created_at": "2023-05-10T14:30:00Z",
    "updated_at": "2023-05-10T15:00:00Z"
  }
  ```
- Success: 200 OK
- Errors:
  - 400 Bad Request (Validation errors)
  - 401 Unauthorized
  - 403 Forbidden (Not user's note)
  - 404 Not Found

**Delete Note**

- Method: `DELETE`
- Path: `/notes/{noteId}`
- Description: Delete a note
- Headers: Authorization: Bearer {access_token}
- Response Body: Empty
- Success: 204 No Content
- Errors:
  - 401 Unauthorized
  - 403 Forbidden (Not user's note)
  - 404 Not Found

### AI Notes Generation

**Generate Note with AI**

- Method: `POST`
- Path: `/ai/generate-note`
- Description: Generate a note from source text using AI
- Headers: Authorization: Bearer {access_token}
- Request Body:
  ```json
  {
    "source_text": "Original educational material text to summarize"
  }
  ```
- Response Body:
  ```json
  {
    "content": "AI generated summary content"
  }
  ```
- Success: 200 OK
- Errors:
  - 400 Bad Request (Text too long or invalid format)
  - 401 Unauthorized
  - 429 Too Many Requests (Rate limit exceeded)
  - 500 Internal Server Error (AI service error)
  - 504 Gateway Timeout (AI generation took too long)

## 3. Authentication and Authorization

The API uses Supabase Auth for authentication with JWT tokens:

1. **Authentication Flow**:

   - User registers or logs in via Supabase Auth endpoints
   - User receives JWT access
   - JWT access token must be included in the Authorization header for all protected endpoints

2. **Authorization**:

   - Row Level Security (RLS) in Supabase ensures users can only access their own notes
   - API backend validates user permissions before processing requests
   - All note-related endpoints check that the user_id of the note matches the authenticated user

3. **Token Format**:
   - Bearer token in Authorization header: `Authorization: Bearer {jwt_token}`

## 4. Validation and Business Logic

### Validation Rules

**Notes**:

- Title:
  - Required
  - Maximum 50 characters
- Content:
  - Required
  - Maximum 1000 characters
- Source Text:
  - Optional (required only for AI notes)
  - Maximum 25,000 characters (~5,000 words)
- Source:
  - Required
  - Must be one of: "AI" or "Manual"

**AI Text Input**:

- Source Text:
  - Required
  - Maximum 25,000 characters (~5,000 words)

### Business Logic Implementation

1. **Notes Listing and Sorting**:

   - Default sorting is by creation date (newest first)
   - RLS ensures users only see their own notes

2. **AI Note Generation**:

   - Server validates input text length before processing
   - AI processing timeout set to maximum 30 seconds
   - Error handling for AI service failures
   - Generated notes have a maximum length of 1000 characters

3. **User Data Management**:

   - Notes are automatically linked to the authenticated user
   - On user deletion, all associated notes are cascaded deleted

4. **Performance Considerations**:
   - Rate limiting on AI generation endpoints (maximum requests per minute)
   - Database indexing on user_id + created_at for efficient note retrieval
   - Response caching for frequently accessed notes (with cache invalidation on updates)
