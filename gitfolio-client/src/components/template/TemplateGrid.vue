<template>
    <div>
        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-3 mb-6">
            <!-- Search hint badge -->
            <span class="text-xs text-white/30">
                {{ filtered.length }} template{{ filtered.length !== 1 ? 's' : '' }}
            </span>

            <div class="flex gap-2 ml-auto flex-wrap">
                <!-- Tier filter -->
                <div class="flex bg-bg-3 border border-border rounded-xl p-1 gap-1">
                    <button v-for="tier in ['all', 'free', 'premium']" :key="tier"
                        @click="store.setFilter({ tier: tier === 'all' ? '' : tier })"
                        class="text-xs px-3 py-1.5 rounded-lg transition-all"
                        :class="activeTier === tier ? 'bg-accent text-white' : 'text-white/40 hover:text-white'">
                        {{ tier }}
                    </button>
                </div>

                <!-- Category filter -->
                <select class="input text-xs py-1.5 px-3 w-auto" :value="store.filter.category"
                    @change="store.setFilter({ category: ($event.target as HTMLSelectElement).value })">
                    <option value="">All categories</option>
                    <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
            </div>
        </div>

        <!-- Grid -->
        <div v-if="store.loading" class="flex justify-center py-20">
            <LoadingSpinner size="lg" />
        </div>

        <div v-else-if="filtered.length === 0" class="text-center py-20 text-white/30">
            No templates found.
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <TemplateCard v-for="t in filtered" :key="t.id" :template="t" :selected="store.selected === t.id"
                @select="onSelect" />
        </div>

        <!-- Login prompt for premium -->
        <div v-if="!auth.isAuthenticated" class="mt-8 card p-6 text-center border-accent/20 bg-accent/5">
            <p class="text-sm text-white/60 mb-4">
                Sign in to unlock <span class="text-accent-2 font-semibold">premium templates</span> and save your
                READMEs.
            </p>
            <button @click="auth.loginWithGithub()" class="btn-primary mx-auto">
                <GithubIcon :size="14" />
                Sign in with GitHub
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Github as GithubIcon } from 'lucide-vue-next'
import { useTemplatesStore } from '../../stores/templates'
import { useAuthStore } from '../../stores/auth'
import TemplateCard from './TemplateCard.vue'
import LoadingSpinner from '../ui/LoadingSpinner.vue'

const emit = defineEmits<{ select: [id: string] }>()
const store = useTemplatesStore()
const auth = useAuthStore()

const filtered = computed(() => store.filtered)
const activeTier = computed(() => store.filter.tier || 'all')

onMounted(() => store.fetchAll())

function onSelect(id: string) {
    store.select(id)
    emit('select', id)
}
</script>