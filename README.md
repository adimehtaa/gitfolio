# gitfolio

we are working on it.

# 1. Install correct versions
npm install -D prisma@latest
npm install @prisma/client@latest

# 2. Init Prisma (if new project)
npx prisma init

# 3. Update schema.prisma generator block to use new provider
# generator client { provider = "prisma-client" }

# 4. Run generate
npx prisma generate

# 5. Run migrations
npx prisma migrate dev --name init