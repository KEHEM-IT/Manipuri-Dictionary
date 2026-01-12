# Admin Panel Documentation

## Overview
The Bishnupriya Manipuri Dictionary Admin Panel provides a secure interface for managing dictionary content and users.

## File Structure

```
src/client/
├── admin/
│   └── dashboard.vue              # Main dashboard component
├── components/
│   └── admin/
│       └── LoginForm.vue          # Login form component
├── composables/
│   └── admin/
│       └── useAdminAuth.ts        # Authentication composable
├── views/
│   └── admin/
│       ├── AdminLogin.vue         # Login page wrapper
│       └── AdminDashboard.vue     # Dashboard page wrapper
└── router/
    └── index.ts                   # Router configuration with admin routes
```

## Routes

### Public Routes
- `/khm-admin` - Redirects to login
- `/khm-admin/login` - Admin login page

### Protected Routes (Requires Authentication)
- `/khm-admin/dashboard` - Admin dashboard

## Authentication

### Demo Credentials
For testing purposes, use:
- **Username:** `admin`
- **Password:** `admin123`

### How It Works

1. **Login Process:**
   - User enters credentials on `/khm-admin/login`
   - Credentials are validated (currently demo, replace with API)
   - Token and user data stored in localStorage/sessionStorage
   - User redirected to dashboard

2. **Session Management:**
   - "Remember Me" checkbox uses `localStorage` (persistent)
   - Without "Remember Me" uses `sessionStorage` (session-only)

3. **Route Protection:**
   - Navigation guard checks authentication before each route
   - Redirects to login if accessing protected route without auth
   - Redirects to dashboard if accessing login while authenticated

## Components

### LoginForm.vue
- Responsive login form with dark mode design
- Password visibility toggle
- Remember me checkbox
- Error and success message display
- Loading states
- FontAwesome icons

### Dashboard.vue
- Responsive admin dashboard
- Stats cards (Total Words, Active Users, etc.)
- Quick actions panel
- Recent activity feed
- Dictionary entries table with pagination
- User menu with logout functionality

## Composables

### useAdminAuth.ts

Provides authentication functionality:

```typescript
const { 
  login,           // Login function
  logout,          // Logout function
  checkAuth,       // Check if user is authenticated
  getCurrentUser,  // Get current user data
  isLoading,       // Loading state
  errorMessage,    // Error message
  successMessage   // Success message
} = useAdminAuth();
```

## Usage

### Accessing the Admin Panel

1. Navigate to `http://localhost:5173/khm-admin`
2. Login with credentials
3. Access the dashboard

### Logout

Click the user avatar → Logout

## Customization

### Replacing Demo Authentication

In `src/client/composables/admin/useAdminAuth.ts`, replace the demo login logic:

```typescript
// Replace this demo logic
if (credentials.username === 'admin' && credentials.password === 'admin123') {
  // ...
}

// With actual API call
const response = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: credentials.username,
    password: credentials.password
  })
});

const data = await response.json();
// Handle response...
```

### Adding New Admin Routes

1. Create view component in `src/client/views/admin/`
2. Add route in `src/client/router/index.ts`:

```typescript
{
  path: '/khm-admin/users',
  name: 'AdminUsers',
  component: () => import('../views/admin/AdminUsers.vue'),
  meta: { requiresAuth: true }
}
```

### Adding Sidebar Menu Items

In `dashboard.vue`:

```typescript
const menuItems = [
  // ... existing items
  { name: 'Users Management', icon: 'fa-users-cog' },
  { name: 'Categories', icon: 'fa-tags' },
];
```

## Security Notes

⚠️ **Important:**
- Replace demo authentication with secure API
- Use HTTPS in production
- Implement proper token validation
- Add CSRF protection
- Implement rate limiting
- Use secure password hashing (bcrypt/argon2)
- Add two-factor authentication for enhanced security

## Features

✅ Dark mode design
✅ Fully responsive (mobile, tablet, desktop)
✅ FontAwesome icons
✅ Route protection
✅ Session management
✅ Remember me functionality
✅ Loading states
✅ Error handling
✅ User dropdown menu
✅ Logout confirmation

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Dependencies

- Vue 3
- Vue Router 4
- TypeScript
- Tailwind CSS
- FontAwesome 6.5.1
