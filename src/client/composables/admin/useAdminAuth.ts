// src/client/composables/admin/useAdminAuth.ts
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export function useAdminAuth() {
  const router = useRouter();
  const isLoading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  const currentUser = ref<AdminUser | null>(null);

  // Check if user is already logged in
  const checkAuth = (): boolean => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    
    if (token && user) {
      try {
        currentUser.value = JSON.parse(user);
        return true;
      } catch (e) {
        logout();
        return false;
      }
    }
    return false;
  };

  // Login function
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      // Simulate API call - Replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo credentials - Replace with actual authentication
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const user: AdminUser = {
          id: '1',
          username: credentials.username,
          email: 'admin@bmdictionary.com',
          role: 'admin'
        };

        const token = 'demo_token_' + Date.now(); // Replace with actual token from API

        // Store authentication data
        if (credentials.rememberMe) {
          localStorage.setItem('admin_token', token);
          localStorage.setItem('admin_user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('admin_token', token);
          sessionStorage.setItem('admin_user', JSON.stringify(user));
        }

        currentUser.value = user;
        successMessage.value = 'Login successful! Redirecting...';

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/khm-admin/dashboard');
        }, 500);
      } else {
        errorMessage.value = 'Invalid username or password';
      }
    } catch (error) {
      errorMessage.value = 'An error occurred during login. Please try again.';
      console.error('Login error:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    currentUser.value = null;
    router.push('/khm-admin/login');
  };

  // Get current user
  const getCurrentUser = (): AdminUser | null => {
    if (currentUser.value) {
      return currentUser.value;
    }

    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');

    if (token && userStr) {
      try {
        currentUser.value = JSON.parse(userStr);
        return currentUser.value;
      } catch (e) {
        return null;
      }
    }

    return null;
  };

  return {
    isLoading,
    errorMessage,
    successMessage,
    currentUser,
    login,
    logout,
    checkAuth,
    getCurrentUser
  };
}
