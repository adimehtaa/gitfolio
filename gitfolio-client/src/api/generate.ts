import { api } from './client'

type GeneratePayload = {
  username: string
  templateId: string
  options?: {
    theme?: string
    sections?: string[]
  }
}

type GenerateResponse = {
  content: string
  html?: string
}

export const generateApi = {
  generate: async (payload: GeneratePayload) => {
    const res = await api.post<GenerateResponse>('/generate', payload)
    return res.data
  },
}