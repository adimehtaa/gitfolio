import { api } from './client'

type AdminUser = {
    id: string
    username: string
    banned: boolean
}
export const adminApi = {
    overview: () =>
        api.get('/admin/analytics/overview'),

    users: (page = 1, search = '') =>
        api.get('/admin/users', {
            params: { page, search },
        }),

    setRole: (id: string, role: string) =>
        api.patch(`/admin/users/${id}/role`, { role }),

    deleteUser: (id: string) =>
        api.delete(`/admin/users/${id}`),

    templates: () =>
        api.get('/admin/templates'),

    toggleTemplate: (id: string) =>
        api.patch(`/admin/templates/${id}/toggle`),

    featureTemplate: (id: string) =>
        api.patch(`/admin/templates/${id}/feature`),
};