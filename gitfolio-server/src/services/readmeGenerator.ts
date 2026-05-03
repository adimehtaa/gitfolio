import { prisma } from "../prisma/client.js";
import type { GitHubProfile, TemplateOptions } from "../templates/types.js";
import { templateRegistry } from "./templateRegistry.js";


export async function generateReadme(
    templateId: string,
    profile: GitHubProfile,
    options: TemplateOptions = {},
    userId: string
): Promise<string> {
    const template = templateRegistry.get(templateId)

    if (!template) throw Object.assign(new Error(`Template "${templateId}" not found`), { statusCode: 404 })

    const markdown = template.generate(profile, options)

    prisma.template.update({
        where: { slug: templateId },
        data: { usageCount: { increment: 1 } },
    }).catch(() => { })

    if (userId) {
        prisma.analyticsEvent.create({
            data: {
                userId,
                event: 'readme_generated',
                meta: {
                    templateId,
                    githubUsername: profile.user.login,
                },
            }
        })
    }

    return markdown;
}