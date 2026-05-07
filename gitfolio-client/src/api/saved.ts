import { api } from './client'

type SavedItem = {
    id: string
    name: string
    content: string
    githubUsername: string
    templateId?: string
    createdAt: string
}

export const savedApi = {
    list: async () => {
        const res = await api.get<SavedItem[]>('/saved')
        return res.data
    },

    create: async (data: {
        name: string
        content: string
        githubUsername: string
        templateId?: string
    }) => {
        const res = await api.post<SavedItem>('/saved', data)
        return res.data
    },

    update: async (
        id: string,
        data: { name?: string; content?: string }
    ) => {
        const res = await api.put<SavedItem>(`/saved/${id}`, data)
        return res.data
    },

    delete: async (id: string) => {
        await api.delete(`/saved/${id}`)
    },
}