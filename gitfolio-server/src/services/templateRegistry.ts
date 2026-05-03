import fs from 'node:fs'
import path from 'node:path'
import type { Template, TemplateMeta } from '../templates/types.js';

class TemplateRegistry {
    private templates = new Map<string, Template>();
    private loaded = false

    async load() {
        if (this.loaded) return;

        const dirs = ['free', 'premium'];
        const base = path.join(__dirname, '../templates')

        for (const dir of dirs) {
            const folder = path.join(base, dir)

            if (!fs.existsSync(folder)) continue;

            const files = fs.readdirSync(folder).filter(f => f.endsWith('.ts') || f.endsWith('.js'))

            for (const file of files) {
                try {
                    const mod = await import(path.join(folder, file))
                    const template: Template = mod.default

                    if (template?.meta?.id && typeof template.generate === 'function') {
                        this.templates.set(template.meta.id, template);
                        console.log(`  ✓ Template loaded: ${template.meta.id} (${dir})`)
                    }

                } catch (err) {
                    console.error(`  ✗ Failed to load template: ${file}`, err)
                }
            }
        }

        this.loaded = true;
        console.log(`✓ Template registry: ${this.templates.size} templates loaded`)
    }

    get(id: string): Template | undefined {
        return this.templates.get(id);
    }

    getAll(): Template[] {
        return Array.from(this.templates.values())
    }


    getAllFree(): Template[] {
        return this.getAll().filter(t => t.meta.tier === 'free');
    }

    getAllPremium(): Template[] {
        return this.getAll().filter(t => t.meta.tier === 'premium')
    }

    getMeta(): TemplateMeta[] {
        return this.getAll().map(t => t.meta)
    }

    has(id : string) : boolean {
        return this.templates.has(id);
    }
}


export const templateRegistry = new TemplateRegistry();