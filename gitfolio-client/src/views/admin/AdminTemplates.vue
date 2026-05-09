<!-- gitfolio-client/src/views/admin/AdminTemplates.vue -->
<template>
    <div class="max-w-5xl mx-auto px-4 py-10">
        <div class="flex items-center justify-between mb-8">
            <h1 class="font-display text-2xl font-bold">Templates</h1>
            <RouterLink to="/admin" class="btn-ghost text-xs">← Admin</RouterLink>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
            <div class="w-8 h-8 border-2 border-bg-4 border-t-accent rounded-full animate-spin" />
        </div>

        <div v-else class="card overflow-hidden">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-border text-white/30 text-xs uppercase tracking-widest">
                        <th class="text-left p-4">Template</th>
                        <th class="text-left p-4">Tier</th>
                        <th class="text-left p-4">Category</th>
                        <th class="text-right p-4">Uses</th>
                        <th class="text-right p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in templates" :key="t.id"
                        class="border-b border-border/50 hover:bg-bg-3/50 transition-colors"
                        :class="{ 'opacity-40': !t.isActive }">
                        <td class="p-4">
                            <div>
                                <p class="font-medium text-sm">{{ t.name }}</p>
                                <p class="text-xs text-white/30 font-mono">{{ t.slug }}</p>
                            </div>
                        </td>
                        <td class="p-4">
                            <span class="badge text-[10px]" :class="t.tier === 'FREE' ? 'badge-free' : 'badge-premium'">
                                {{ t.tier }}
                            </span>
                        </td>
                        <td class="p-4 text-xs text-white/40">{{ t.category }}</td>
                        <td class="p-4 text-right font-mono text-xs text-white/40">
                            {{ t.usageCount.toLocaleString() }}
                        </td>
                        <td class="p-4 text-right">
                            <div class="flex items-center gap-2 justify-end">
                                <button @click="toggleFeatured(t)"
                                    class="btn-ghost text-xs py-1 px-2 border border-border"
                                    :class="{ 'text-accent-2 border-accent/30': t.isFeatured }">
                                    {{ t.isFeatured ? '★ Featured' : '☆ Feature' }}
                                </button>
                                <button @click="toggleActive(t)"
                                    class="btn-ghost text-xs py-1 px-2 border border-border"
                                    :class="t.isActive ? 'text-green-400 border-green-500/20' : 'text-red-400 border-red-500/20'">
                                    {{ t.isActive ? 'Enabled' : 'Disabled' }}
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { adminApi } from '../../api/admin'

const toast = useToast()
const templates = ref<any[]>([])
const loading = ref(true)

async function fetchTemplates() {
    loading.value = true
    try {
        const { data } = await adminApi.templates()
        templates.value = data
    } finally {
        loading.value = false
    }
}

async function toggleActive(t: any) {
    try {
        const { data } = await adminApi.toggleTemplate(t.id)
        t.isActive = data.isActive
        toast.success(`${t.name} ${data.isActive ? 'enabled' : 'disabled'}`)
    } catch { toast.error('Failed') }
}

async function toggleFeatured(t: any) {
    try {
        const { data } = await adminApi.featureTemplate(t.id)
        t.isFeatured = data.isFeatured
        toast.success(`${t.name} ${data.isFeatured ? 'featured' : 'unfeatured'}`)
    } catch { toast.error('Failed') }
}

onMounted(fetchTemplates)
</script>