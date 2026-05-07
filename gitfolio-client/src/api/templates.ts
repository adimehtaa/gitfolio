import { api } from './client'

type Template = {
    id: string
    name: string
    category: string
    tier: string
}

type TemplateFilters = {
    category?: string
    tier?: string
}

export const templatesApi = {
    list: async (params?: TemplateFilters) => {
        const res = await api.get<Template[]>('/templates', { params })
        return res.data
    },

    get: async (id: string) => {
        const res = await api.get<Template>(`/templates/${id}`)
        return res.data
    },
}