// frontend/src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import WordDetail from '../views/WordDetail.vue';
import SearchResults from '../views/SearchResults.vue';
import AddWord from '../views/AddWord.vue';
import AdminLogin from '../views/admin/AdminLogin.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/search',
        name: 'SearchResults',
        component: SearchResults
    },
    {
        path: '/add-word',
        name: 'AddWord',
        component: AddWord
    },
    {
        // allow any text (including URL-encoded unicode) after /word/
        path: '/word/:identifier(.*)',
        name: 'WordDetail',
        component: WordDetail
    },
    // Admin Routes
    {
        path: '/khm-admin',
        redirect: '/khm-admin/login'
    },
    {
        path: '/khm-admin/login',
        name: 'AdminLogin',
        component: AdminLogin,
        meta: { requiresGuest: true }
    },
    {
        path: '/khm-admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    const isAuthenticated = !!token;

    // Check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/khm-admin/login');
    }
    // Check if route requires guest (not logged in)
    else if (to.meta.requiresGuest && isAuthenticated) {
        next('/khm-admin/dashboard');
    }
    else {
        next();
    }
});

export default router;
