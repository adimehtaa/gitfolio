export interface GitHubProfile {
    user: {
        login: string
        name: string | null
        bio: string | null
        avatar_url: string
        location: string | null
        company: string | null
        blog: string | null
        twitter_username: string | null
        public_repos: number
        followers: number
        following: number
    }
    topRepos: Array<{
        name: string
        description: string | null
        html_url: string
        stargazers_count: number
        forks_count: number
        language: string | null
    }>
    languages: string[]
}

export interface TemplateOptions {
    theme?: string
    sections?: string[]
    customVars?: Record<string, string>
}

export interface TemplateMeta {
    id: string
    name: string
    description: string
    tier: 'free' | 'premium'
    category: 'minimal' | 'developer' | 'creative' | 'hacker' | 'professional' | 'animated' | 'community'
    tags: string[]
    previewImage?: string
    defaultTheme?: string
    supportedSections: string[]
}

export interface Template {
    meta: TemplateMeta
    generate: (profile: GitHubProfile, options?: TemplateOptions) => string
}
