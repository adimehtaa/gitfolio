import type { BlockMeta } from '../types/builder'

export const BLOCK_REGISTRY: BlockMeta[] = [
    {
        type: 'bio',
        label: 'Bio & Header',
        icon: '◉',
        description: 'Name, bio, avatar, location',
        defaultConfig: { showAvatar: true, showLocation: true, showCompany: true, align: 'center' },
    },
    {
        type: 'typing_svg',
        label: 'Typing Animation',
        icon: '▶',
        description: 'Animated typing text header',
        defaultConfig: {
            typingLines: ["Hi, I'm a Developer 👋", 'Open Source Enthusiast'],
            typingFont: 'Fira Code',
            typingColor: '7C6AF7',
            typingSize: 24,
        },
    },
    {
        type: 'stats',
        label: 'GitHub Stats',
        icon: '◈',
        description: 'Commits, PRs, issues, stars card',
        defaultConfig: { theme: 'dark', showIcons: true, countPrivate: true, showRank: true },
    },
    {
        type: 'streak',
        label: 'Streak Stats',
        icon: '◆',
        description: 'Current streak and longest streak',
        defaultConfig: { streakTheme: 'dark' },
    },
    {
        type: 'languages',
        label: 'Top Languages',
        icon: '◇',
        description: 'Most used programming languages',
        defaultConfig: { theme: 'dark', langLayout: 'compact', langCount: 8 },
    },
    {
        type: 'repos',
        label: 'Featured Repos',
        icon: '▣',
        description: 'Top starred repositories',
        defaultConfig: { repoCount: 4, showStars: true, showForks: true, showLanguage: true },
    },
    {
        type: 'badges',
        label: 'Skill Badges',
        icon: '▦',
        description: 'Tech stack shields.io badges',
        defaultConfig: { badgeStyle: 'flat-square', selectedLangs: [], customBadges: [] },
    },
    {
        type: 'contribution_graph',
        label: 'Contribution Graph',
        icon: '▤',
        description: 'Activity graph for the past year',
        defaultConfig: { graphTheme: 'github-compact' },
    },
    {
        type: 'social',
        label: 'Social Links',
        icon: '◎',
        description: 'Twitter, website, LinkedIn badges',
        defaultConfig: { showTwitter: true, showWebsite: true, showLinkedIn: false },
    },
    {
        type: 'visitors',
        label: 'Visitor Counter',
        icon: '◌',
        description: 'Profile view counter badge',
        defaultConfig: {},
    },
    {
        type: 'divider',
        label: 'Divider',
        icon: '—',
        description: 'Visual separator between sections',
        defaultConfig: { dividerStyle: 'line' },
    },
    {
        type: 'custom_text',
        label: 'Custom Text',
        icon: '✎',
        description: 'Free-form markdown content',
        defaultConfig: { content: '## My Section\n\nWrite anything here…' },
    },
    {
        type: 'image',
        label: 'Image',
        icon: '⊞',
        description: 'Any image by URL',
        defaultConfig: { imageUrl: '', imageAlt: 'image', imageWidth: '100%', align: 'center' },
    },
]

export function getBlockMeta(type: string): BlockMeta {
    return BLOCK_REGISTRY.find(b => b.type === type) ?? BLOCK_REGISTRY[0]
}