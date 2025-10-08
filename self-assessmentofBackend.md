### Implementing Secure Authentication with Passport

Before

```js
//  JWT-only setup
app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && user.password === req.body.password) {
    const token = generateToken(user._id);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
```

After

```js
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL // Before this , we wrote this "/api/auth/google/callback" but it does not work properly after deploying eventhough it works well on local so changed to this 
}, async (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));
```

Key Improvements
Added Google OAuth 2.0 login alongside JWT authentication.
Improved user serialization/deserialization for hybrid session/JWT workflows.
Secured routes using ExtractJwt.fromAuthHeaderAsBearerToken().
Simplified integration by separating authentication logic into its own file.
Enhanced overall security, flexibility, and maintainability of the auth system.

### Improving User Authentication
Before 

```js
const register = async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email exists" });
  const user = new User({ username, email, password });
  await user.save();
  res.status(201).json({ user });
};
```

After

```js
const { validationResult } = require('express-validator');
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;
  const [userByName, userByEmail] = await Promise.all([
    User.findOne({ username }),
    User.findOne({ email })
  ]);

  if (userByEmail && userByEmail.googleId && !userByEmail.password) {
    userByEmail.username = username;
    userByEmail.password = password;
    userByEmail.addAuthMethod('local');
    await userByEmail.save();
    return res.json({ message: 'Linked Google and local login' });
  }

  const user = new User({ username, email, password, authMethods: ['local'] });
  await user.save();
  res.status(201).json({ message: 'Registered successfully', user });
};
```
Key Changes
Added input validation using express-validator.
Improved performance by checking username and email in parallel.
Supported merging Google and local accounts.
Standardized API responses for better consistency.

### Handling Google OAuth Login
Before

```js
app.get('/auth/google/callback', (req, res) => {
  const user = req.user;
  if (!user) return res.redirect('/login');
  res.send('Google login success');
});

```

After

```js
const googleCallback = async (req, res) => {
  if (!req.user) return res.redirect(`${process.env.FRONTEND_URL}/#/login?error=google_auth_failed`);
  const { id, displayName, emails } = req.user;
  const email = emails[0].value;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ username: displayName || email.split('@')[0], email, googleId: id, authMethods: ['google'] });
    await user.save();
  } else if (!user.googleId) {
    await user.mergeGoogleAccount(id, email);
  }

  const token = generateToken(user._id);
  res.redirect(`${process.env.FRONTEND_URL}/#/login?token=${token}&success=google_login`);
};
```

Key Changes
Added logic to merge existing local and Google accounts safely.
Improved error handling and redirect consistency.
Implemented JWT token generation for smoother login flow.
Ensured email uniqueness across authentication methods.

### Shopping Cart Management

Before

```js
app.post('/cart', (req, res) => {
  const { ingredientId, quantity } = req.body;
  user.shoppingCart.push({ ingredientId, quantity });
  user.save();
  res.send('Added to cart');
});
I improved the whole structure to make it more robust. The updated version now validates inputs, checks for existing items before adding, recalculates totals, and provides consistent API responses.
```

After

```js
const addToCart = async (req, res) => {
  const { ingredientId, quantity, unit } = req.body;
  const ingredient = await Ingredient.findOne({ id: ingredientId });
  const user = await User.findById(req.user._id);

  const existingIndex = user.shoppingCart.findIndex(item => item.ingredientId === ingredientId);
  if (existingIndex > -1) {
    user.shoppingCart[existingIndex].quantity += quantity;
  } else {
    user.shoppingCart.push({
      ingredientId: ingredient.id,
      name: ingredient.name,
      quantity,
      unit,
      price: ingredient.price
    });
  }

  user.markModified('shoppingCart');
  await user.save();
  res.status(201).json({ success: true, message: 'Item added to cart' });
};
```
Key Changes
Added input validation and quantity checks.
Implemented duplicate item handling to avoid multiple entries.
Improved error messages and response structure.
Added total price calculation in getCart() for better UI integration and like the normal shooping cart on other website

### Recipe Management System

Before

```js
app.get('/recipes', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});
```

After

```js
const toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user._id);
  const recipe = await Recipe.findById(req.params.id);
  const isFavorited = user.favoriteRecipes.includes(recipe._id);

  if (isFavorited) {
    user.favoriteRecipes.pull(recipe._id);
  } else {
    user.favoriteRecipes.push(recipe._id);
  }
  await user.save();
  res.json({ success: true });
};
```

Key Improvements
Added complete CRUD operations with validation and error handling.
Implemented image upload and cleanup for recipe files.
Added filtering and full-text search features.
Integrated user favorites with precise ObjectId checks.
Improved response consistency and error logging for debugging.
