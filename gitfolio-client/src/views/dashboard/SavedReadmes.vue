<template>
    <div class="max-w-4xl mx-auto px-4 py-10">
        <div class="flex items-center justify-between mb-8">
            <h1 class="font-display text-2xl font-bold">Saved READMEs</h1>
            <RouterLink to="/generate" class="btn-primary text-sm">+ New README</RouterLink>
        </div>

        <LoadingSpinner v-if="loading" class="py-20" />

        <div v-else-if="readmes.length === 0" class="card p-12 text-center">
            <p class="text-white/30 text-sm">No saved READMEs yet.</p>
            <RouterLink to="/generate" class="btn-primary mt-4 inline-flex">Generate your first</RouterLink>
        </div>

        <div v-else class="space-y-3">
            <div v-for="readme in readmes" :key="readme.id"
                class="card p-4 flex items-center gap-4 hover:border-border-2 transition-colors">
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-sm truncate">{{ readme.name }}</p>
                    <p class="text-xs text-white/30 font-mono mt-0.5">
                        @{{ readme.githubUsername }} ·
                        {{ readme.template?.name || 'Custom' }} ·
                        {{ new Date(readme.updatedAt).toLocaleDateString() }}
                    </p>
                    <p v-if="readme.pushedAt" class="text-[10px] text-green-400 mt-0.5">
                        Pushed {{ new Date(readme.pushedAt).toLocaleDateString() }}
                    </p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <button @click="loadInEditor(readme)" class="btn-secondary text-xs py-1.5 px-3">Edit</button>
                    <button @click="deleteReadme(readme.id)"
                        class="btn-ghost text-xs text-red-400 hover:text-red-300">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { savedApi } from '../../api/saved'
import { useEditorStore } from '../../stores/editor'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const router = useRouter()
const editor = useEditorStore()
const toast = useToast()
const readmes = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
    const data = await savedApi.list()
    readmes.value = data
    loading.value = false
})

function loadInEditor(readme: any) {
    editor.setMarkdown(readme.content)
    editor.setTemplate(readme.template?.slug || 'minimal')
    router.push('/editor')
}

async function deleteReadme(id: string) {
    if (!confirm('Delete this README?')) return
    await savedApi.delete(id)
    readmes.value = readmes.value.filter(r => r.id !== id)
    toast.success('Deleted.')
}
</script>