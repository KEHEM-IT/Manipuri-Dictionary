<!-- src/client/views/admin/AdminDashboard.vue -->
<template>
  <DashboardLayout />
</template>

<script setup lang="ts">
import DashboardLayout from '../../admin/dashboard.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminAuth } from '../../composables/admin/useAdminAuth';

const router = useRouter();
const { checkAuth } = useAdminAuth();

// Redirect to login if not authenticated
onMounted(() => {
  if (!checkAuth()) {
    router.push('/khm-admin/login');
  }
});
</script>
