import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ top: 0 }),
    routes: [

        // Public routes
        {
            path: '/',
            component: () => import('../views/Home.vue')
        },

        // Auth-required routes
        {
            path: '/dashboard/templates',
            component: () => import('../views/dashboard/CustomTemplates.vue'),
            meta: { requiresAuth: true },
        },

        // Admin routes
        {
            path: '/admin',
            component: () => import('../views/admin/AdminDashboard.vue'),
            meta: { requiresAuth: true, requiresAdmin: true },
        }
    ]
})

router.beforeEach(async (to) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return {
            path: '/',
            query: {
                login: '1'
            }
        }
    }

    if (to.meta.requiresAdmin && !auth.isAdmin) {
        return {
            path: '/dashboard'
        }
    }
})

export default router