import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from '../api/auth'

export const useAuthStore = defineStore(
    'auth',
    () => {
        const token = ref<string | null>(null)
        const user = ref<any | null>(null)
        const loading = ref(false)

        const isAuthenticated = computed(() => !!token.value)
        const isAdmin = computed(() => user.value?.role === 'ADMIN')

        function setToken(t: string) {
            token.value = t
        }

        async function logout() {
            try {
                await authApi.logout()
            } catch (_) { }

            token.value = null
            user.value = null
        }

        async function fetchMe() {
            if (!token.value) return

            loading.value = true
            try {
                const res = await authApi.me()
                user.value = res.data
            } catch (e) {
                logout()
            } finally {
                loading.value = false
            }
        }

        function loginWithGithub() {
            window.location.href = `${import.meta.env.VITE_API_URL || '/api'
                }/auth/github`
        }

        return {
            // state
            token,
            user,
            loading,

            // getters
            isAuthenticated,
            isAdmin,

            // actions
            setToken,
            logout,
            fetchMe,
            loginWithGithub,
        }
    },
    {
        persist: false
    }
)