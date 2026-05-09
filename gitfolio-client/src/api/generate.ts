// gitfolio-client/src/api/generate.ts
import { api } from './client'

export const generateApi = {
  generate: (payload: {
    username: string
    templateId: string
    options?: { theme?: string; sections?: string[] }
  }) => api.post('/generate', payload),
}