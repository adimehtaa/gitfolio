import { api } from './client'

type AdminUser = {
    id: string
    username: string
    banned: boolean
}

export const adminApi = {
    overview: async () => {
        const res = await api.get('/admin/analytics/overview')
        return res.data
    },

    users: async (page = 1) => {
        const res = await api.get<AdminUser[]>('/admin/users', {
            params: { page },
        })
        return res.data
    },

    banUser: async (id: string) => {
        await api.patch(`/admin/users/${id}/ban`)
    },

    templates: async () => {
        const res = await api.get('/admin/templates')
        return res.data
    },

    toggleTemplate: async (id: string) => {
        await api.patch(`/admin/templates/${id}/toggle`)
    },

    featureTemplate: async (id: string) => {
        await api.patch(`/admin/templates/${id}/feature`)
    },
}