import { api } from './client'

export const templatesApi = {
    list: (params?: { category?: string; tier?: string }) =>
        api.get('/templates', { params }),
    get: (id: string) => api.get(`/templates/${id}`),
}