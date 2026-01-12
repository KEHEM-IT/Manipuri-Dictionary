<!-- src/client/components/admin/LoginForm.vue -->
<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg mb-4">
          <i class="fas fa-book text-white text-2xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Admin Login</h1>
        <p class="text-gray-400">Bishnupriya Manipuri Dictionary</p>
      </div>

      <!-- Login Card -->
      <div class="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <!-- Alert Messages -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-start">
          <i class="fas fa-exclamation-circle text-red-400 mt-0.5 mr-3"></i>
          <div>
            <p class="text-red-300 text-sm font-medium">{{ errorMessage }}</p>
          </div>
        </div>

        <div v-if="successMessage" class="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg flex items-start">
          <i class="fas fa-check-circle text-green-400 mt-0.5 mr-3"></i>
          <div>
            <p class="text-green-300 text-sm font-medium">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin">
          <!-- Username Field -->
          <div class="mb-6">
            <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
              <i class="fas fa-user mr-2"></i>Username
            </label>
            <input
              id="username"
              v-model="loginData.username"
              type="text"
              required
              placeholder="Enter your username"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              :disabled="isLoading"
            />
          </div>

          <!-- Password Field -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              <i class="fas fa-lock mr-2"></i>Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="loginData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Enter your password"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                :disabled="isLoading"
              >
                <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="loginData.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                :disabled="isLoading"
              />
              <span class="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
            <a href="#" class="text-sm text-blue-400 hover:text-blue-300">
              Forgot password?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-sign-in-alt mr-2"></i>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6 flex items-center">
          <div class="flex-1 border-t border-gray-700"></div>
          <span class="px-4 text-sm text-gray-500">or</span>
          <div class="flex-1 border-t border-gray-700"></div>
        </div>

        <!-- Back to Home -->
        <div class="mt-6 text-center">
          <router-link to="/" class="text-sm text-gray-400 hover:text-gray-300 inline-flex items-center">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Dictionary
          </router-link>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          © 2025 Bishnupriya Manipuri Dictionary. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAdminAuth } from '../../composables/admin/useAdminAuth';

const { login, isLoading, errorMessage, successMessage } = useAdminAuth();

const loginData = ref({
  username: '',
  password: '',
  rememberMe: false
});

const showPassword = ref(false);

const handleLogin = async () => {
  await login(loginData.value);
};
</script>
