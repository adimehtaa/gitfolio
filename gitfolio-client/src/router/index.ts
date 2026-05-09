import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ top: 0 }),
    routes: [
        // Public
        {
            path: '/',
            component: () => import('../views/Home.vue')
        },
        {
            path: '/generate',
            component: () => import('../views/Generator.vue')
        },
        {
            path: '/editor',
            component: () => import('../views/Editor.vue')
        },
        {
            path: '/templates',
            component: () => import('../views/Templates.vue')
        },
        {
            path: '/oauth/callback',
            component: () => import('../views/OAuthCallback.vue')
        },

        // Auth required
        {
            path: '/dashboard',
            component: () => import('../views/dashboard/Dashboard.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/saved',
            component: () => import('../views/dashboard/SavedReadmes.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/templates',
            component: () => import('../views/dashboard/CustomTemplates.vue'),
            meta: { requiresAuth: true },
        },

        // Admin
        {
            path: '/admin',
            component: () => import('../views/admin/AdminDashboard.vue'),
            meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
            path: '/admin/users',
            component: () => import('../views/admin/AdminUsers.vue'),
            meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
            path: '/admin/templates',
            component: () => import('../views/admin/AdminTemplates.vue'),
            meta: { requiresAuth: true, requiresAdmin: true },
        },

        { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
})

router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.isAuthenticated) return { path: '/', query: { login: '1' } }
    if (to.meta.requiresAdmin && !auth.isAdmin) return { path: '/dashboard' }
})

export default router