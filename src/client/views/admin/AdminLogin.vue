<!-- src/client/views/admin/AdminLogin.vue -->
<template>
  <LoginForm />
</template>

<script setup lang="ts">
import LoginForm from '../../components/admin/LoginForm.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminAuth } from '../../composables/admin/useAdminAuth';

const router = useRouter();
const { checkAuth } = useAdminAuth();

// Redirect to dashboard if already logged in
onMounted(() => {
  if (checkAuth()) {
    router.push('/khm-admin/dashboard');
  }
});
</script>
