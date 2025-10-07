# CookEase API Documentation

Complete API reference for the CookEase Recipe Management System.

## Base URL

- **Development**: `http://localhost:5001`
- **Production**: `https://group3-recipe-web.onrender.com`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Main Endpoints

### Health Check

#### GET /health
Check server status and health.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-07T18:32:09.818Z",
  "environment": "development"
}
```

---

### Authentication

#### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Validation Rules:**
- `username`: 3-30 characters, alphanumeric and underscores only
- `email`: Valid email format
- `password`: Minimum 6 characters, must contain uppercase, lowercase, and number

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "authMethods": ["local"],
    "createdAt": "2025-10-07T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Validation failed
- `409`: Username or email already exists

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "authMethods": ["local"],
    "createdAt": "2025-10-07T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Missing or invalid credentials
- `401`: Invalid email or password

#### GET /api/auth/google
Initiate Google OAuth login. Redirects to Google authentication.

**Usage:** Direct users to this endpoint to start Google OAuth flow.

#### GET /api/auth/google/callback
Google OAuth callback endpoint (handled automatically by Passport.js).

**Response:** Redirects to frontend with authentication result.

#### GET /api/auth/user
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "authMethods": ["local", "google"],
    "createdAt": "2025-10-07T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Invalid or missing token

#### PUT /api/auth/update-profile
Update user profile information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "username": "new_username",
  "password": "NewPassword123"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "username": "new_username",
    "email": "john@example.com",
    "authMethods": ["local"],
    "createdAt": "2025-10-07T10:00:00.000Z"
  }
}
```

---

### Recipes

#### GET /api/recipes
Get all recipes with optional filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `cuisine` (optional): Filter by cuisine type
- `difficulty` (optional): Filter by difficulty (Easy, Medium, Hard)
- `prepTime` (optional): Maximum preparation time in minutes
- `search` (optional): Search in recipe names and descriptions

**Example:**
```
GET /api/recipes?page=1&limit=12&cuisine=Italian&difficulty=Easy&search=pasta
```

**Response (200):**
```json
{
  "recipes": [
    {
      "_id": "recipe_id",
      "name": "Spaghetti Carbonara",
      "description": "Classic Italian pasta dish",
      "cuisine": "Italian",
      "difficulty": "Easy",
      "prepTime": 20,
      "cookTime": 15,
      "servings": 4,
      "ingredients": [
        {
          "name": "Spaghetti",
          "quantity": "400g",
          "price": 2.50
        }
      ],
      "instructions": ["Step 1", "Step 2"],
      "nutrition": {
        "calories": 450,
        "protein": 20,
        "carbs": 55,
        "fat": 15
      },
      "image": "/images/recipes/carbonara.png",
      "createdAt": "2025-10-07T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecipes": 45,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /api/recipes/filter-options
Get available filter options for recipes.

**Response (200):**
```json
{
  "cuisines": ["Italian", "Chinese", "American", "French"],
  "difficulties": ["Easy", "Medium", "Hard"],
  "prepTimes": [15, 30, 45, 60]
}
```

#### GET /api/recipes/filter
Filter recipes based on criteria.

**Query Parameters:**
- `cuisine`: Cuisine type
- `difficulty`: Difficulty level
- `prepTime`: Maximum preparation time

#### GET /api/recipes/search
Search recipes by name or description.

**Query Parameters:**
- `q`: Search query string

#### GET /api/recipes/:id
Get a specific recipe by ID.

**Parameters:**
- `id`: Recipe ID

**Response (200):**
```json
{
  "_id": "recipe_id",
  "name": "Spaghetti Carbonara",
  "description": "Classic Italian pasta dish",
  "cuisine": "Italian",
  "difficulty": "Easy",
  "prepTime": 20,
  "cookTime": 15,
  "servings": 4,
  "ingredients": [
    {
      "name": "Spaghetti",
      "quantity": "400g",
      "price": 2.50
    }
  ],
  "instructions": ["Step 1", "Step 2"],
  "nutrition": {
    "calories": 450,
    "protein": 20,
    "carbs": 55,
    "fat": 15
  },
  "image": "/images/recipes/carbonara.png",
  "createdAt": "2025-10-07T10:00:00.000Z"
}
```

**Error Responses:**
- `404`: Recipe not found

#### POST /api/recipes
Create a new recipe (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "My New Recipe",
  "description": "A delicious homemade dish",
  "cuisine": "American",
  "difficulty": "Medium",
  "prepTime": 30,
  "cookTime": 45,
  "servings": 6,
  "ingredients": [
    {
      "name": "Ingredient 1",
      "quantity": "2 cups",
      "price": 3.99
    }
  ],
  "instructions": ["Step 1", "Step 2", "Step 3"],
  "nutrition": {
    "calories": 350,
    "protein": 15,
    "carbs": 40,
    "fat": 12
  }
}
```

**Response (201):**
```json
{
  "message": "Recipe created successfully",
  "recipe": {
    "_id": "new_recipe_id",
    "name": "My New Recipe",
    "description": "A delicious homemade dish",
    "cuisine": "American",
    "difficulty": "Medium",
    "prepTime": 30,
    "cookTime": 45,
    "servings": 6,
    "ingredients": [
      {
        "name": "Ingredient 1",
        "quantity": "2 cups",
        "price": 3.99
      }
    ],
    "instructions": ["Step 1", "Step 2", "Step 3"],
    "nutrition": {
      "calories": 350,
      "protein": 15,
      "carbs": 40,
      "fat": 12
    },
    "createdAt": "2025-10-07T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Validation error
- `401`: Authentication required

#### PUT /api/recipes/:id
Update an existing recipe.

**Parameters:**
- `id`: Recipe ID

**Request Body:** Same as POST /api/recipes

**Response (200):**
```json
{
  "message": "Recipe updated successfully",
  "recipe": {
    // Updated recipe object
  }
}
```

**Error Responses:**
- `400`: Validation error
- `404`: Recipe not found

#### DELETE /api/recipes/:id
Delete a recipe (requires authentication).

**Parameters:**
- `id`: Recipe ID

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Recipe deleted successfully"
}
```

**Error Responses:**
- `401`: Authentication required
- `404`: Recipe not found

---

### Favorites Management

#### GET /api/recipes/favorites
Get user's favorite recipes (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "favorites": [
    {
      "_id": "recipe_id",
      "name": "Spaghetti Carbonara",
      // ... other recipe fields
    }
  ]
}
```

**Error Responses:**
- `401`: Authentication required

#### PATCH /api/recipes/:id/favorite
Toggle recipe favorite status (requires authentication).

**Parameters:**
- `id`: Recipe ID

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Recipe added to favorites"
}
```
or
```json
{
  "message": "Recipe removed from favorites"
}
```

**Error Responses:**
- `401`: Authentication required
- `404`: Recipe not found

---

### Shopping Cart

#### GET /api/cart
Get user's shopping cart (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "cart": {
    "items": [
      {
        "ingredient": {
          "_id": "ingredient_id",
          "name": "Tomatoes",
          "prices": {
            "S-Kaupat": 2.49,
            "K-Ruoka": 2.39,
            "Lidl": 2.19
          }
        },
        "quantity": 2,
        "selectedMarket": "Lidl"
      }
    ],
    "totalPrice": 4.38,
    "lastUpdated": "2025-10-07T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Authentication required

#### POST /api/cart/add
Add item to shopping cart (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "ingredientId": "ingredient_id",
  "quantity": 2,
  "selectedMarket": "Lidl"
}
```

**Response (200):**
```json
{
  "message": "Item added to cart",
  "cart": {
    // Updated cart object
  }
}
```

**Error Responses:**
- `400`: Invalid ingredient or quantity
- `401`: Authentication required
- `404`: Ingredient not found

#### PUT /api/cart/:ingredientId
Update cart item quantity or market (requires authentication).

**Parameters:**
- `ingredientId`: Ingredient ID to update

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "quantity": 3,
  "selectedMarket": "S-Kaupat"
}
```

**Response (200):**
```json
{
  "message": "Cart item updated",
  "cart": {
    // Updated cart object
  }
}
```

**Error Responses:**
- `400`: Invalid data
- `401`: Authentication required
- `404`: Item not found in cart

#### DELETE /api/cart/:ingredientId
Remove item from cart (requires authentication).

**Parameters:**
- `ingredientId`: Ingredient ID to remove

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Item removed from cart",
  "cart": {
    // Updated cart object
  }
}
```

**Error Responses:**
- `401`: Authentication required
- `404`: Item not found in cart

#### DELETE /api/cart
Clear entire shopping cart (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Cart cleared",
  "cart": {
    "items": [],
    "totalPrice": 0,
    "lastUpdated": "2025-10-07T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Authentication required

---

### Ingredients

#### GET /api/ingredients
Get all available ingredients.

**Response (200):**
```json
{
  "ingredients": [
    {
      "_id": "ingredient_id",
      "name": "Tomatoes",
      "category": "Vegetables",
      "prices": {
        "S-Kaupat": 2.49,
        "K-Ruoka": 2.39,
        "Lidl": 2.19
      },
      "image": "/images/ingredients/tomatoes.png"
    }
  ]
}
```

or (alternative format based on actual implementation):
```json
[
  {
    "_id": "ingredient_id",
    "name": "Tomatoes",
    "category": "Vegetables",
    "prices": {
      "S-Kaupat": 2.49,
      "K-Ruoka": 2.39,
      "Lidl": 2.19
    },
    "image": "/images/ingredients/tomatoes.png"
  }
]
```

#### GET /api/ingredients/:id
Get specific ingredient by ID.

**Parameters:**
- `id`: Ingredient ID

**Response (200):**
```json
{
  "_id": "ingredient_id",
  "name": "Tomatoes",
  "category": "Vegetables",
  "prices": {
    "S-Kaupat": 2.49,
    "K-Ruoka": 2.39,
    "Lidl": 2.19
  },
  "image": "/images/ingredients/tomatoes.png"
}
```

**Error Responses:**
- `404`: Ingredient not found
- `500`: Server error

---

### AI Recommendations

#### GET /api/ai/recommendations
Get AI-powered recipe recommendations (authentication optional).

**Headers (Optional):**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `preferences`: User preferences (cuisine, difficulty, etc.)
- `availableIngredients`: Available ingredients for recommendations

**Note:** If authenticated, recommendations will be personalized based on user's favorite recipes. If not authenticated, popular recipes will be recommended.

**Response (200):**
```json
{
  "recommendations": [
    {
      "recipe": {
        "_id": "recipe_id",
        "name": "Spaghetti with Tomato Basil",
        "description": "Simple Italian pasta dish",
        "cuisine": "Italian",
        "difficulty": "Easy",
        "prepTime": 20
      },
      "score": 0.95,
      "reason": "Matches your cuisine preference and uses available ingredients"
    }
  ]
}
```

**Error Responses:**
- `429`: Rate limit exceeded (100 requests per 15 minutes)
- `500`: AI service unavailable

---

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

or

```json
{
  "message": "Error message",
  "errors": [
    {
      "field": "fieldname",
      "message": "Field-specific error message"
    }
  ]
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required/failed)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

---

## Rate Limiting

- **Authentication endpoints**: 100 requests per 15 minutes per IP
- **AI recommendation endpoints**: 100 requests per 15 minutes per IP
- **Other endpoints**: No rate limiting applied

---

## Security Features

- **JWT Authentication**: Secure token-based authentication with expiration
- **Password Hashing**: bcrypt with salt for secure password storage
- **Input Validation**: Comprehensive request validation using express-validator
- **CORS Protection**: Configured for allowed origins
- **Helmet.js**: Security headers and protection against common vulnerabilities
- **Rate Limiting**: Protection against abuse and DoS attacks
- **Google OAuth**: Secure third-party authentication integration

---

## Environment Variables

Required environment variables for proper API functionality:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/cookease

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback

# AI Integration
GEMINI_API_KEY=your-gemini-api-key

# Server Configuration
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```