import type { Template } from '../types.js'

const terminal: Template = {
    meta: {
        id: 'terminal',
        name: 'Terminal',
        description: 'Hacker-style terminal aesthetic with code blocks and ASCII.',
        tier: 'premium',
        category: 'hacker',
        tags: ['dark', 'hacker', 'terminal', 'code'],
        supportedSections: ['header', 'stats', 'skills', 'projects', 'social'],
        defaultTheme: 'dark',
    },
    generate(profile, options = {}) {
        const { user, topRepos, languages } = profile
        const login = user.login

        return `\`\`\`bash
$ whoami
${login}

$ cat about.txt
Name    : ${user.name || login}
Bio     : ${user.bio || 'No bio set'}
Location: ${user.location || 'Unknown'}
Company : ${user.company || 'Independent'}
Repos   : ${user.public_repos}
Followers: ${user.followers}
\`\`\`

\`\`\`bash
$ ls -la skills/
${languages.map(l => `drwxr-xr-x  ${l}/`).join('\n')}
\`\`\`

\`\`\`bash
$ git log --oneline --graph HEAD~5
${topRepos.slice(0, 5).map((r, i) => `* ${r.name} - ${r.description || 'No description'} ⭐${r.stargazers_count}`).join('\n')}
\`\`\`

\`\`\`bash
$ curl -s https://github-readme-stats.vercel.app/api?username=${login}
\`\`\`

![Stats](https://github-readme-stats.vercel.app/api?username=${login}&show_icons=true&theme=dark&hide_border=true)

\`\`\`bash
$ echo "Find me at:"
${[
                user.blog && `echo "  Website : ${user.blog}"`,
                user.twitter_username && `echo "  Twitter : @${user.twitter_username}"`,
                `echo "  GitHub  : https://github.com/${login}"`,
            ].filter(Boolean).join('\n')}
\`\`\``
    }
}

export default terminal