<template>
    <div class="max-w-6xl mx-auto px-4 py-10">
        <h1 class="font-display text-2xl font-bold mb-8">Admin Dashboard</h1>

        <LoadingSpinner v-if="loading" class="py-20" />

        <template v-else>
            <!-- Stats grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div v-for="stat in stats" :key="stat.label" class="card p-5">
                    <p class="text-xs text-white/30 mb-1">{{ stat.label }}</p>
                    <p class="text-3xl font-bold font-mono">{{ stat.value.toLocaleString() }}</p>
                </div>
            </div>

            <!-- Top templates -->
            <div class="card p-6 mb-6">
                <h2 class="font-semibold mb-4 text-sm">Top Templates by Usage</h2>
                <div class="space-y-3">
                    <div v-for="(t, i) in overview?.topTemplates" :key="t.slug" class="flex items-center gap-3">
                        <span class="text-xs text-white/20 w-4 font-mono">{{ (i as number) + 1 }}</span>
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-xs font-medium">{{ t.name }}</span>
                                <span class="text-xs text-white/40 font-mono">{{ t.usageCount.toLocaleString() }}</span>
                            </div>
                            <div class="h-1.5 bg-bg-3 rounded-full overflow-hidden">
                                <div class="h-full bg-accent rounded-full transition-all"
                                    :style="{ width: `${(t.usageCount / maxUsage) * 100}%` }" />
                            </div>
                        </div>
                        <span class="badge text-[10px]"
                            :class="t.category === 'HACKER' ? 'badge-premium' : 'badge-free'">
                            {{ t.category }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Admin nav -->
            <div class="grid grid-cols-2 gap-4">
                <RouterLink to="/admin/users" class="card p-5 hover:border-border-2 transition-colors group">
                    <UsersIcon :size="18" class="text-white/30 mb-2 group-hover:text-accent-2 transition-colors" />
                    <h3 class="font-semibold text-sm">Manage Users</h3>
                    <p class="text-xs text-white/30 mt-1">View, search, and manage all user accounts.</p>
                </RouterLink>
                <RouterLink to="/admin/templates" class="card p-5 hover:border-border-2 transition-colors group">
                    <LayoutIcon :size="18" class="text-white/30 mb-2 group-hover:text-accent-2 transition-colors" />
                    <h3 class="font-semibold text-sm">Manage Templates</h3>
                    <p class="text-xs text-white/30 mt-1">Enable, disable, or feature templates.</p>
                </RouterLink>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Users as UsersIcon, Layout as LayoutIcon } from 'lucide-vue-next'
import { adminApi } from '../../api/admin'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const overview = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
    const { data } = await adminApi.overview()
    overview.value = data
    loading.value = false
})

const stats = computed(() => [
    { label: 'Total Users', value: Number(overview.value?.totalUsers ?? 0) },
    { label: 'READMEs Generated', value: Number(overview.value?.totalReadmes ?? 0) },
    { label: 'READMEs Pushed', value: Number(overview.value?.totalPushes ?? 0) },
    { label: 'New Today', value: Number(overview.value?.newUsersToday ?? 0) },
])

const maxUsage = computed(() =>
    Math.max(...(overview.value?.topTemplates?.map((t: any) => t.usageCount) ?? [1]))
)
</script>