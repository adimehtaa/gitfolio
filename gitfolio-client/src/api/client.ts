import axios from 'axios'
import { useAuthStore } from '../stores/auth'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const auth = useAuthStore()

    if (auth.token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${auth.token}`
    }

    return config
})

let refreshing = false
let queue: Array<{
    resolve: (value: any) => void
    reject: (reason?: any) => void
}> = []

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const auth = useAuthStore()
        const original = err.config

        if (err.response?.status === 401 && !(original as any)._retry && auth.token) {

            if (refreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({ resolve, reject })
                }).then(() => api(original))
            }

            ; (original as any)._retry = true
            refreshing = true

            try {
                const { data } = await api.post('/auth/refresh')

                auth.setToken(data.accessToken)

                queue.forEach(p => p.resolve(null))
                queue = []

                return api(original)

            } catch (error) {
                queue.forEach(p => p.reject(error))
                queue = []

                auth.logout()
                window.location.href = '/'
                return Promise.reject(error)

            } finally {
                refreshing = false
            }
        }

        return Promise.reject(err)
    }
)