export type BlockType =
    | 'bio'
    | 'stats'
    | 'streak'
    | 'languages'
    | 'repos'
    | 'badges'
    | 'social'
    | 'contribution_graph'
    | 'visitors'
    | 'typing_svg'
    | 'custom_text'
    | 'divider'
    | 'image'

export interface BlockConfig {
    // bio
    showAvatar?: boolean
    showLocation?: boolean
    showCompany?: boolean
    align?: 'left' | 'center' | 'right'

    // stats
    theme?: string
    showIcons?: boolean
    countPrivate?: boolean
    showRank?: boolean

    // streak
    streakTheme?: string

    // languages
    langLayout?: 'compact' | 'normal' | 'donut' | 'pie'
    langCount?: number
    hideLangs?: string[]

    // repos
    repoCount?: number
    showStars?: boolean
    showForks?: boolean
    showLanguage?: boolean

    // badges
    badgeStyle?: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic'
    selectedLangs?: string[]
    customBadges?: Array<{ label: string; message: string; color: string }>

    // social
    showTwitter?: boolean
    showWebsite?: boolean
    showLinkedIn?: boolean
    linkedInUrl?: string

    // contribution_graph
    graphTheme?: string

    // typing_svg
    typingLines?: string[]
    typingFont?: string
    typingColor?: string
    typingSize?: number

    // custom_text
    content?: string

    // image
    imageUrl?: string
    imageAlt?: string
    imageWidth?: string

    // divider
    dividerStyle?: 'line' | 'wave'
}

export interface Block {
    id: string
    type: BlockType
    config: BlockConfig
}

export interface BlockMeta {
    type: BlockType
    label: string
    icon: string
    description: string
    defaultConfig: BlockConfig
}