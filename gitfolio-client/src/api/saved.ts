import { api } from './client'

export const savedApi = {
    list: () =>
        api.get('/saved').then(r => r.data),  // unwrap for convenience
    create: (data: { name: string; content: string; githubUsername: string; templateId?: string }) =>
        api.post('/saved', data),
    update: (id: string, data: { name?: string; content?: string }) =>
        api.put(`/saved/${id}`, data),
    delete: (id: string) =>
        api.delete(`/saved/${id}`),
}