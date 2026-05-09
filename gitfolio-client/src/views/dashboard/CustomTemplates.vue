<!-- gitfolio-client/src/views/dashboard/CustomTemplates.vue -->
<template>
    <div class="flex flex-col h-[calc(100vh-56px)] overflow-hidden">

        <!-- Top bar -->
        <div class="h-12 bg-bg-2 border-b border-border flex items-center px-4 gap-4 shrink-0">
            <RouterLink to="/dashboard" class="btn-ghost text-xs py-1 px-2">← Dashboard</RouterLink>
            <input v-model="builder.templateName"
                class="bg-transparent outline-none text-sm font-semibold text-white placeholder-white/20 flex-1 max-w-xs"
                placeholder="Template name…" />
            <span class="text-white/20 text-xs ml-auto">{{ builder.blocks.length }} block{{ builder.blocks.length !== 1
                ? 's' : '' }}</span>

            <div class="flex items-center gap-2">
                <button @click="showPreview = !showPreview" class="btn-ghost text-xs">
                    {{ showPreview ? 'Hide Preview' : 'Preview' }}
                </button>
                <button @click="clearAll" class="btn-ghost text-xs text-white/30">Clear</button>
                <button @click="saveTemplate" :disabled="builder.saving || !builder.blocks.length"
                    class="btn-primary text-xs py-2">
                    <span v-if="builder.saving"
                        class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {{ builder.saving ? 'Saving…' : 'Save Template' }}
                </button>
            </div>
        </div>

        <!-- Main 3-column layout -->
        <div class="flex-1 flex overflow-hidden">
            <BlockToolbar />

            <!-- Canvas -->
            <div class="flex-1 flex flex-col overflow-hidden bg-bg">
                <BlockCanvas />
            </div>

            <!-- Settings panel -->
            <BlockSettings />

            <!-- Live preview (toggleable) -->
            <Transition name="slide-r">
                <div v-if="showPreview" class="w-72 shrink-0 border-l border-border flex flex-col overflow-hidden">
                    <div class="px-4 py-2 border-b border-border bg-bg-2">
                        <span class="text-[10px] font-mono uppercase tracking-widest text-white/20">Preview</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4 bg-bg">
                        <div class="md-preview text-xs" v-html="renderedHtml" />
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { useToast } from 'vue-toastification'
import { useBuilderStore } from '../../stores/builder'
import { useProfileStore } from '../../stores/profile'
import { api } from '../../api/client'
import BlockToolbar from '../../components/builder/BlockToolbar.vue'
import BlockCanvas from '../../components/builder/BlockCanvas.vue'
import BlockSettings from '../../components/builder/BlockSettings.vue'

const router = useRouter()
const toast = useToast()
const builder = useBuilderStore()
const profile = useProfileStore()

const showPreview = ref(true)

marked.setOptions({ gfm: true, breaks: true })
const renderedHtml = computed(() => {
    const md = builder.getMarkdown(profile.username || 'username', profile.data)
    if (!md) return '<p class="text-white/20 italic text-xs">Add blocks to see preview…</p>'
    return DOMPurify.sanitize(marked.parse(md) as string, {
        ADD_TAGS: ['img'], ADD_ATTR: ['align', 'src', 'alt', 'height', 'width', 'style']
    })
})

function clearAll() {
    if (!builder.blocks.length || confirm('Clear all blocks?')) builder.reset()
}

async function saveTemplate() {
    if (!builder.blocks.length) return
    builder.saving = true
    try {
        await api.post('/custom-templates', {
            name: builder.templateName,
            blocks: builder.blocks,
            markdown: builder.getMarkdown('{{username}}'),
        })
        toast.success('Template saved!')
        router.push('/dashboard')
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Save failed')
    } finally {
        builder.saving = false
    }
}
</script>

<style scoped>
.slide-r-enter-active,
.slide-r-leave-active {
    transition: all .2s ease;
}

.slide-r-enter-from,
.slide-r-leave-to {
    opacity: 0;
    transform: translateX(16px);
}
</style>