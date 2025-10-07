# CookEase - Recipe Management System

A full-stack web application for recipe management with AI-powered recommendations.

##  Live Demo
- **Production**: https://group3-recipe-web.onrender.com

##  Features
- User Authentication (Local & Google OAuth)
- Recipe Management
- Favorites System
- Shopping Cart with Price Comparison
- AI Recipe Recommendations

##  Tech Stack
- **Frontend**: React 19.1.1, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, Passport.js
- **AI**: Google Gemini API

## 📚 API Documentation

### Base URL
- Development: http://localhost:5001
- Production: https://group3-recipe-web.onrender.com

### Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Main Endpoints

#### Health Check
- GET /health - Server status

#### Authentication
- POST /api/auth/signup - Register user
- POST /api/auth/login - Login user
- GET /api/auth/google - Google OAuth login
- GET /api/auth/user - Get current user

#### Recipes
- GET /api/recipes - Get all recipes (with filters)
- GET /api/recipes/:id - Get recipe by ID
- POST /api/recipes - Create recipe (auth required)
- PUT /api/recipes/:id - Update recipe (auth required)
- DELETE /api/recipes/:id - Delete recipe (auth required)

#### Favorites
- GET /api/recipes/favorites - Get user favorites (auth required)
- PATCH /api/recipes/:id/favorite - Toggle favorite status (auth required)

#### Shopping Cart
- GET /api/cart - Get user cart (auth required)
- POST /api/cart/add - Add item to cart (auth required)
- PUT /api/cart/:ingredientId - Update cart item (auth required)
- DELETE /api/cart/:ingredientId - Remove item (auth required)
- DELETE /api/cart - Clear cart (auth required)

#### Ingredients
- GET /api/ingredients - Get all ingredients
- GET /api/ingredients/:id - Get ingredient by ID

#### AI Recommendations
- GET /api/ai/recommendations - Get recipe recommendations (optional auth)

## 🔒 Security
- JWT Authentication
- Password hashing with bcrypt
- Rate limiting (100 req/15min for auth)
- CORS protection
- Helmet.js security headers

##  Deployment
Set environment variables and build/deploy the application.
