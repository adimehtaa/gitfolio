import type { Block } from '../types/builder'

const STATS = 'https://github-readme-stats.vercel.app/api'
const STREAK = 'https://github-readme-streak-stats.herokuapp.com'
const BADGES = 'https://img.shields.io/badge'

const LANG_COLORS: Record<string, string> = {
    JavaScript: 'F7DF1E', TypeScript: '3178C6', Python: '3776AB',
    Go: '00ADD8', Rust: 'CE422B', Java: 'ED8B00', 'C++': '00599C',
    Ruby: 'CC342D', PHP: '777BB4', Swift: 'FA7343', Kotlin: '7F52FF',
    Vue: '42b883', React: '61DAFB', Svelte: 'FF3E00', Dart: '0175C2',
    default: '555555',
}

function langBadge(lang: string, style = 'flat-square') {
    const color = LANG_COLORS[lang] ?? LANG_COLORS['default']
    const logo = lang.toLowerCase().replace(/\+/g, 'plus').replace(/#/g, 'sharp').replace(/ /g, '')
    return `![${lang}](${BADGES}/${encodeURIComponent(lang)}-${color}?style=${style}&logo=${logo}&logoColor=white)`
}

export function renderBlock(block: Block, username: string, profile?: any): string {
    const { type, config } = block
    const u = username || 'username'

    switch (type) {

        case 'bio': {
            const user = profile?.user
            if (!user) return `<!-- bio: no profile loaded -->`
            const lines: string[] = []
            if (config.showAvatar) {
                lines.push(`<div align="center">\n<img src="${user.avatar_url}" width="120" style="border-radius:50%"/>\n</div>`)
            }
            lines.push(config.align === 'center'
                ? `<h1 align="center">${user.name || user.login}</h1>`
                : `# ${user.name || user.login}`)
            if (user.bio) lines.push(config.align === 'center'
                ? `<p align="center"><em>${user.bio}</em></p>`
                : `> ${user.bio}`)
            const meta = [
                config.showLocation && user.location && `📍 ${user.location}`,
                config.showCompany && user.company && `🏢 ${user.company}`,
            ].filter(Boolean).join(' · ')
            if (meta) lines.push(config.align === 'center' ? `<p align="center">${meta}</p>` : meta)
            return lines.join('\n\n')
        }

        case 'typing_svg': {
            const lines = (config.typingLines ?? ['Hello World!']).join(';').replace(/ /g, '+')
            const font = (config.typingFont ?? 'Fira+Code').replace(/ /g, '+')
            const color = config.typingColor ?? '7C6AF7'
            const size = config.typingSize ?? 24
            return `<div align="center">\n<img src="https://readme-typing-svg.demolab.com?font=${font}&size=${size}&pause=1000&color=${color}&center=true&vCenter=true&width=600&lines=${lines}" />\n</div>`
        }

        case 'stats': {
            const t = config.theme ?? 'dark'
            const qi = config.showIcons ? '&show_icons=true' : ''
            const qp = config.countPrivate ? '&count_private=true' : ''
            const qr = config.showRank ? '&rank_icon=github' : ''
            return `<div align="center">\n<img src="${STATS}?username=${u}&theme=${t}&hide_border=true${qi}${qp}${qr}" />\n</div>`
        }

        case 'streak': {
            const t = config.streakTheme ?? 'dark'
            return `<div align="center">\n<img src="${STREAK}/?user=${u}&theme=${t}&hide_border=true" />\n</div>`
        }

        case 'languages': {
            const t = config.theme ?? 'dark'
            const ly = config.langLayout ?? 'compact'
            const lc = config.langCount ?? 8
            const qh = config.hideLangs?.length ? `&hide=${config.hideLangs.join(',')}` : ''
            return `<div align="center">\n<img src="${STATS}/top-langs?username=${u}&layout=${ly}&theme=${t}&hide_border=true&langs_count=${lc}${qh}" />\n</div>`
        }

        case 'repos': {
            const repos = (profile?.topRepos ?? []).slice(0, config.repoCount ?? 4)
            if (!repos.length) return `<!-- repos: no profile loaded -->`
            return repos.map((r: any) => {
                const badgeParts = [
                    config.showStars && `![Stars](${BADGES}/stars-${r.stargazers_count}-gold?style=flat-square)`,
                    config.showForks && `![Forks](${BADGES}/forks-${r.forks_count}-blue?style=flat-square)`,
                    config.showLanguage && r.language && `![Lang](${BADGES}/${encodeURIComponent(r.language)}-informational?style=flat-square)`,
                ].filter(Boolean).join(' ')
                return `### [${r.name}](${r.html_url})\n${r.description ?? ''}\n\n${badgeParts}`
            }).join('\n\n---\n\n')
        }

        case 'badges': {
            const style = config.badgeStyle ?? 'flat-square'
            const langBadges = (config.selectedLangs ?? []).map(l => langBadge(l, style))
            const customBadges = (config.customBadges ?? []).map(b =>
                `![${b.label}](${BADGES}/${encodeURIComponent(b.label)}-${encodeURIComponent(b.message)}-${b.color}?style=${style})`
            )
            const all = [...langBadges, ...customBadges]
            return all.length ? all.join(' ') : `<!-- badges: select languages in settings -->`
        }

        case 'contribution_graph': {
            const t = config.graphTheme ?? 'github-compact'
            return `<img src="https://github-readme-activity-graph.vercel.app/graph?username=${u}&theme=${t}&hide_border=true" width="100%" />`
        }

        case 'social': {
            const user = profile?.user
            const parts: string[] = []
            if (config.showTwitter && user?.twitter_username)
                parts.push(`[![Twitter](${BADGES}/-@${user.twitter_username}-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${user.twitter_username})`)
            if (config.showWebsite && user?.blog)
                parts.push(`[![Website](${BADGES}/-Website-000?style=for-the-badge&logo=firefox)](${user.blog})`)
            if (config.showLinkedIn && config.linkedInUrl)
                parts.push(`[![LinkedIn](${BADGES}/-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](${config.linkedInUrl})`)
            parts.push(`[![GitHub](${BADGES}/-${u}-181717?style=for-the-badge&logo=github)](https://github.com/${u})`)
            return `<div align="center">\n\n${parts.join('\n')}\n\n</div>`
        }

        case 'visitors':
            return `<div align="center">\n<img src="https://komarev.com/ghpvc/?username=${u}&color=7c6af7&style=for-the-badge" />\n</div>`

        case 'divider':
            return config.dividerStyle === 'wave'
                ? `<img src="https://capsule-render.vercel.app/api?type=waving&color=7C6AF7&height=60&section=footer" width="100%" />`
                : `---`

        case 'custom_text':
            return config.content ?? ''

        case 'image': {
            if (!config.imageUrl) return `<!-- image: set URL in settings -->`
            return config.align === 'center'
                ? `<div align="center">\n<img src="${config.imageUrl}" alt="${config.imageAlt ?? 'image'}" width="${config.imageWidth ?? '100%'}" />\n</div>`
                : `![${config.imageAlt ?? 'image'}](${config.imageUrl})`
        }

        default:
            return ''
    }
}

export function renderBlocks(blocks: Block[], username: string, profile?: any): string {
    return blocks
        .map(b => renderBlock(b, username, profile))
        .filter(Boolean)
        .join('\n\n')
}