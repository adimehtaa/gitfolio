
import { api } from "./client";

export const authApi = {
    me: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
    refresh: () => api.post('/auth/refresh'),
}