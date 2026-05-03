import { PrismaClient, TemplateTier, TemplateCategory } from "../../generated/prisma/client.js"
import { env } from "../config/env.js"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

// Create a connection pool and pass it to the adapter
const pool = new pg.Pool({ connectionString: env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

const templates = [
  { slug: 'minimal',       name: 'Minimal',       tier: TemplateTier.FREE,    category: TemplateCategory.MINIMAL,      sortOrder: 1  },
  { slug: 'developer',     name: 'Developer',     tier: TemplateTier.FREE,    category: TemplateCategory.DEVELOPER,    sortOrder: 2  },
  { slug: 'creative',      name: 'Creative',      tier: TemplateTier.FREE,    category: TemplateCategory.CREATIVE,     sortOrder: 3  },
  { slug: 'terminal',      name: 'Terminal',      tier: TemplateTier.PREMIUM, category: TemplateCategory.HACKER,       sortOrder: 10 },
  { slug: 'glassmorphism', name: 'Glassmorphism', tier: TemplateTier.PREMIUM, category: TemplateCategory.CREATIVE,     sortOrder: 11 },
  { slug: 'hacker',        name: 'Hacker',        tier: TemplateTier.PREMIUM, category: TemplateCategory.HACKER,       sortOrder: 12 },
  { slug: 'corporate',     name: 'Corporate',     tier: TemplateTier.PREMIUM, category: TemplateCategory.PROFESSIONAL, sortOrder: 13 },
  { slug: 'animated',      name: 'Animated',      tier: TemplateTier.PREMIUM, category: TemplateCategory.ANIMATED,     sortOrder: 14 },
]

async function main() {
  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        tier: t.tier,
        category: t.category,
        sortOrder: t.sortOrder,
      },
      create: {
        slug: t.slug,
        name: t.name,
        description: `${t.name} README template`,
        tier: t.tier,
        category: t.category,
        tags: [],
        sortOrder: t.sortOrder,
      },
    })
    console.log(`  ✓ Seeded: ${t.slug}`)
  }
  console.log('Seed complete.')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })