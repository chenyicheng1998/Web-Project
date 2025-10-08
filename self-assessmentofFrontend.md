# Self-Assessment: CookEase React Frontend Project

### Example 1: Improving State Management and User Experience

Initially, our recipe filtering functionality had a basic implementation that could filter recipes but lacked proper loading states and error handling. Here's the original approach:

```javascript
// Basic filtering without proper state management
const handleFilterChange = (newFilters) => {
  setFilters(newFilters);
  // Direct API call without loading states
  fetch(`/api/recipes/filter?${queryParams}`)
    .then(response => response.json())
    .then(data => setFilteredRecipes(data.data));
};
```

This approach worked for basic filtering requests like:
`GET /api/recipes/filter?country=Italian&mainIngredient=tomato`

However, it failed to provide user feedback during:
1. Loading states when filters were being applied
2. Network errors or API failures
3. Empty result scenarios

To address these issues, we refactored the filtering logic with comprehensive state management:

```javascript
// Enhanced filtering with proper state management - Recipes.jsx
const handleFilterChange = async (newFilters) => {
  setFilters(newFilters);
  setLoading(true);
  setError(null);

  try {
    const queryParams = new URLSearchParams();
    
    if (newFilters.country && newFilters.country.length > 0) {
      newFilters.country.forEach(country => queryParams.append('country', country));
    }
    if (newFilters.mainIngredient && newFilters.mainIngredient.length > 0) {
      newFilters.mainIngredient.forEach(ingredient => queryParams.append('mainIngredient', ingredient));
    }
    if (newFilters.allergens && newFilters.allergens.length > 0) {
      newFilters.allergens.forEach(allergen => queryParams.append('allergens', allergen));
    }

    const response = await fetch(`/api/recipes/filter?${queryParams}`);

    if (!response.ok) {
      throw new Error('Failed to filter recipes');
    }

    const data = await response.json();

    if (data.success) {
      setFilteredRecipes(data.data);
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (err) {
    console.error('Error filtering recipes:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Key Improvements:
- **Loading States:** Added proper loading indicators during API calls to improve user experience
- **Error Handling:** Comprehensive error catching and user-friendly error messages
- **Array-based Filters:** Support for multiple selections in each filter category
- **Graceful Degradation:** Proper fallback UI for empty states and errors

---

### Example 2: Context Management and Authentication Flow

We encountered issues with authentication state management across components. Here's the problematic initial setup:

```javascript
// Problematic authentication without proper token validation
const login = (userData, token) => {
  localStorage.setItem('authToken', token);
  setUser(userData);
};
```

This approach had several issues:
1. No token validation on page refresh
2. Inconsistent user state across components
3. No proper cleanup on logout

### Solution:
We implemented a comprehensive Context-based authentication system with proper token validation:

```javascript
// Enhanced UserContext with token validation - UserContext.jsx
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    if (!authToken) {
      setUser(null);
      return;
    }

    fetch('/api/auth/verify-token', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setUser(data.user);
          localStorage.setItem('userInfo', JSON.stringify(data.user));
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
          setAuthToken(null);
          setUser(null);
        }
      })
      .catch(error => {
        console.error('Token verification failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        setAuthToken(null);
        setUser(null);
      });
  }, [authToken]);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setAuthToken(null);
    setUser(null);
  };
};
```

**Lessons Learned:**

1. **State Persistence:** Proper localStorage integration ensures user state persists across browser sessions
2. **Token Validation:** Automatic token verification prevents unauthorized access with expired tokens
3. **Error Recovery:** Graceful cleanup when authentication fails maintains application stability

---

### Example 3: Handling Google OAuth Integration in Hash Router

We faced a challenge integrating Google OAuth with React Hash Router. The initial implementation failed to properly handle OAuth callbacks:

```javascript
// Problematic OAuth handling without Hash Router consideration
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  // This failed with Hash Router
}, []);
```

The issue was that Hash Router uses `#` in URLs, so `window.location.search` was always empty.

### Solution:
We modified the OAuth callback handling to work with Hash Router:

```javascript
// Fixed OAuth handling for Hash Router - LogIn.jsx
useEffect(() => {
  const hash = window.location.hash;
  const urlParams = new URLSearchParams(hash.split('?')[1] || '');
  const token = urlParams.get("token");
  const error = urlParams.get("error");
  const success = urlParams.get("success");

  if (error) {
    console.error("Google login error:", error);
    alert("Google login failed: " + error);
    window.history.replaceState({}, document.title, "/#/login");
    return;
  }

  if (token && success === 'google_login') {
    // Prevent duplicate processing
    const processedTokens = JSON.parse(localStorage.getItem('processedTokens') || '[]');
    if (processedTokens.includes(token)) {
      window.history.replaceState({}, document.title, "/#/login");
      return;
    }

    (async () => {
      const success = await verifyGoogleToken(token);
      if (success) {
        processedTokens.push(token);
        localStorage.setItem('processedTokens', JSON.stringify(processedTokens.slice(-10)));
        navigate("/");
      } else {
        alert("Google login failed!");
      }
      window.history.replaceState({}, document.title, "/#/login");
    })();
  }
}, []);
```

### Key Improvements:
- **Hash Router Compatibility:** Proper URL parameter parsing for hash-based routing
- **Duplicate Prevention:** Token tracking prevents multiple processing of the same OAuth callback
- **URL Cleanup:** Proper history management maintains clean URLs after OAuth processing

**Lessons Learned:**

1. **Router Specifics:** Different router types require different URL handling strategies
2. **OAuth Security:** Preventing token replay attacks through proper tracking mechanisms
3. **User Experience:** Clean URL management and proper error handling improve the authentication flow
