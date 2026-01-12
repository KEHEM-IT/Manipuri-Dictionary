# Admin API Documentation

## Overview
Backend API endpoints for the Bishnupriya Manipuri Dictionary Admin Panel.

## Base URL
```
http://localhost:3000/api/admin
```

## Authentication
All admin endpoints (except `/login`) require authentication using a Bearer token.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Endpoints

### 1. Authentication

#### POST `/login`
Admin login

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@bmdictionary.com",
      "role": "admin"
    },
    "token": "demo_token_1234567890"
  }
}
```

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

---

### 2. Dashboard Statistics

#### GET `/stats`
Get dashboard statistics

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "totalWords": 2547,
    "totalAlphabets": 47,
    "pendingWords": 12,
    "approvedWords": 2547,
    "activeUsers": 1284,
    "dailySearches": 456,
    "weeklyGrowth": 12.5,
    "categories": [
      {
        "name": "noun",
        "count": 1234
      },
      {
        "name": "verb",
        "count": 567
      }
    ]
  }
}
```

---

### 3. Words Management

#### GET `/words`
Get all words with pagination and filters

**Headers:** Requires authentication

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `search` (string) - Search term
- `alphabet` (string) - Filter by alphabet letter
- `status` (string) - Filter by status (all/published/draft)

**Example:**
```
GET /words?page=1&limit=10&search=মানুহ&alphabet=ম
```

**Response:**
```json
{
  "success": true,
  "data": {
    "words": [
      {
        "id": "abc123",
        "bpy": "মানুহ",
        "bn": "মানুষ",
        "en": "Person",
        "cat": ["noun"],
        "meaning": ["Human being"],
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 250,
      "totalPages": 25
    }
  }
}
```

---

#### GET `/word/:id`
Get a single word by ID

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "bpy": "মানুহ",
    "bn": "মানুষ",
    "en": "Person",
    ...
  }
}
```

---

#### POST `/word`
Add a new word to the dictionary

**Headers:** Requires authentication

**Request Body:**
```json
{
  "bpy": "মানুহ",
  "bn": "মানুষ",
  "en": "Person",
  "cat": ["noun"],
  "meaning": ["Human being"],
  "description": "A human being or person",
  "exampleSentences": ["মানুহে খায়"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Word added successfully",
  "data": {
    "id": "generated_id",
    "bpy": "মানুহ",
    ...
  }
}
```

---

#### PUT `/word/:id`
Update an existing word

**Headers:** Requires authentication

**Request Body:** (partial update supported)
```json
{
  "en": "Human",
  "meaning": ["Human being", "Person"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Word updated successfully",
  "data": {
    "id": "abc123",
    ...
  }
}
```

---

#### DELETE `/word/:id`
Delete a word

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "message": "Word deleted successfully"
}
```

---

### 4. Pending Words Management

#### GET `/pending-words`
Get all pending words from user submissions

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "id": "temp123",
      "bpy": "নতুন শব্দ",
      "bn": "নতুন শব্দ",
      "en": "New word",
      "status": "pending",
      "addedAt": "2025-01-12T10:30:00Z",
      "fileName": "ন.json",
      "letter": "ন"
    }
  ]
}
```

---

#### POST `/approve-word/:id`
Approve a pending word and move it to main dictionary

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "message": "Word approved and added to dictionary"
}
```

---

#### DELETE `/pending-word/:id`
Reject a pending word

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "message": "Pending word rejected and removed"
}
```

---

### 5. Alphabets

#### GET `/alphabets`
Get all alphabets with word counts

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "letter": "অ",
      "count": 45
    },
    {
      "letter": "আ",
      "count": 32
    }
  ]
}
```

---

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (no token or invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## File Structure

### Backend Files
```
src/server/
├── routes/
│   ├── admin.ts          # Admin API routes
│   └── dictionary.ts     # Public dictionary routes
├── data/
│   ├── alphabets/        # Main dictionary data (JSON files)
│   └── usersData/        # User-submitted pending words
├── utils/
│   └── alphabetHelper.ts # Helper functions
└── index.ts              # Main server file
```

### Frontend Files
```
src/client/
├── composables/
│   └── admin/
│       ├── useAdminAuth.ts  # Authentication logic
│       └── useAdminApi.ts   # API calls
└── admin/
    └── dashboard.vue         # Dashboard component
```

---

## Security Notes

⚠️ **Important for Production:**

1. **Replace Demo Authentication:**
   - Use proper JWT tokens
   - Implement secure password hashing (bcrypt/argon2)
   - Store credentials in database, not in code

2. **Add Rate Limiting:**
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/admin', limiter);
   ```

3. **Implement CORS properly:**
   ```javascript
   app.use(cors({
     origin: 'https://yourdomain.com',
     credentials: true
   }));
   ```

4. **Add Request Validation:**
   - Use libraries like `joi` or `zod`
   - Validate all input data

5. **Add Logging:**
   - Log all admin actions
   - Track who modified what and when

6. **Use HTTPS in production**

---

## Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Stats (with token):**
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer demo_token_1234567890"
```

**Add Word:**
```bash
curl -X POST http://localhost:3000/api/admin/word \
  -H "Authorization: Bearer demo_token_1234567890" \
  -H "Content-Type: application/json" \
  -d '{
    "bpy": "পানী",
    "bn": "পানি",
    "en": "Water",
    "cat": ["noun"]
  }'
```

---

## Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
DATABASE_URL=your_database_url
```

---

## Starting the Server

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
npm start
```

Server will run on `http://localhost:3000`

---

## Frontend Integration

The frontend uses the `useAdminApi` composable to interact with the API:

```typescript
import { useAdminApi } from '@/composables/admin/useAdminApi';

const { getStats, getWords, addWord } = useAdminApi();

// Fetch stats
const stats = await getStats();

// Get words with pagination
const words = await getWords({ page: 1, limit: 10 });

// Add new word
const newWord = await addWord({
  bpy: "নতুন",
  bn: "নতুন",
  en: "New"
});
```

---

## Future Enhancements

- [ ] Add database integration (MongoDB/PostgreSQL)
- [ ] Implement proper JWT authentication
- [ ] Add user roles and permissions
- [ ] Add activity logs
- [ ] Implement search analytics
- [ ] Add bulk import/export features
- [ ] Add image upload support
- [ ] Implement revision history
- [ ] Add email notifications
- [ ] Add two-factor authentication
