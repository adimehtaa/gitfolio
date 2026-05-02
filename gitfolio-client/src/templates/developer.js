export function generate(profile, options={}){
    const {user, topRepos, languages} = profile;

    const badges = languages.map(lang => 
        `![${lang}](https://img.shields.io/badge/${encodeURIComponent(lang)}-informational?style=flat&logo=${lang.toLowerCase()}&logoColor=white)`
    ).join('  ');

    return `
        <h1 align="center">Hi 👋, I'm ${user.name || user.login}</h1>
        <h3 align="center">${user.bio || 'A passionate developer'}</h3>
        ---

        ${badges}

        <p align="center">
            <img src="" />
            <img src="" />
        </p>

    `.trim();
}