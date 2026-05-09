<template>
    <div class="max-w-5xl mx-auto px-4 py-10">
        <div class="flex items-center gap-4 mb-10">
            <img :src="auth.user?.avatarUrl" class="w-14 h-14 rounded-full border border-border-2" />
            <div>
                <h1 class="font-display text-2xl font-bold">{{ auth.user?.name || auth.user?.login }}</h1>
                <p class="text-sm text-white/40">@{{ auth.user?.login }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div class="card p-5">
                <p class="text-xs text-white/30 mb-1">Saved READMEs</p>
                <p class="text-3xl font-bold font-mono">{{ savedCount }}</p>
            </div>
            <div class="card p-5">
                <p class="text-xs text-white/30 mb-1">Custom Templates</p>
                <p class="text-3xl font-bold font-mono">{{ customCount }}</p>
            </div>
            <div class="card p-5">
                <p class="text-xs text-white/30 mb-1">Account Tier</p>
                <span class="badge badge-premium text-sm">Premium</span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RouterLink to="/dashboard/saved" class="card p-6 hover:border-border-2 transition-colors group">
                <BookmarkIcon :size="20" class="text-white/30 mb-3 group-hover:text-accent-2 transition-colors" />
                <h2 class="font-semibold mb-1">Saved READMEs</h2>
                <p class="text-xs text-white/40">View, edit, and re-push your saved READMEs.</p>
            </RouterLink>

            <RouterLink to="/dashboard/templates" class="card p-6 hover:border-border-2 transition-colors group">
                <LayoutIcon :size="20" class="text-white/30 mb-3 group-hover:text-accent-2 transition-colors" />
                <h2 class="font-semibold mb-1">Custom Templates</h2>
                <p class="text-xs text-white/40">Build and manage your own drag-and-drop templates.</p>
            </RouterLink>

            <RouterLink to="/generate" class="card p-6 hover:border-border-2 transition-colors group">
                <SparklesIcon :size="20" class="text-white/30 mb-3 group-hover:text-accent-2 transition-colors" />
                <h2 class="font-semibold mb-1">Generate New</h2>
                <p class="text-xs text-white/40">Create a fresh README with any of the premium templates.</p>
            </RouterLink>

            <RouterLink to="/templates" class="card p-6 hover:border-border-2 transition-colors group">
                <GridIcon :size="20" class="text-white/30 mb-3 group-hover:text-accent-2 transition-colors" />
                <h2 class="font-semibold mb-1">Browse Templates</h2>
                <p class="text-xs text-white/40">Explore all 100+ templates available to you.</p>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Bookmark as BookmarkIcon, Layout as LayoutIcon, Sparkles as SparklesIcon, Grid as GridIcon } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { savedApi } from '../../api/saved'

const auth = useAuthStore()
const savedCount = ref(0)
const customCount = ref(0)

onMounted(async () => {
    const data = await savedApi.list()
    savedCount.value = data.length
})
</script>