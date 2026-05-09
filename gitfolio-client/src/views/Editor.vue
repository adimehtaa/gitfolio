<template>
    <div class="flex h-[calc(100vh-56px)] overflow-hidden">

        <!-- Sidebar -->
        <aside class="w-64 shrink-0 bg-bg-2 border-r border-border flex flex-col overflow-hidden">
            <div class="p-3 border-b border-border flex items-center justify-between">
                <span class="text-xs font-semibold text-white/30 uppercase tracking-widest">Editor</span>
                <button @click="router.push('/generate')" class="btn-ghost text-xs py-1 px-2">← Back</button>
            </div>

            <!-- Tabs -->
            <div class="flex border-b border-border">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                    class="flex-1 py-2.5 text-xs transition-colors"
                    :class="activeTab === tab.id ? 'text-accent-2 border-b-2 border-accent' : 'text-white/30 hover:text-white'">
                    {{ tab.label }}
                </button>
            </div>

            <div class="flex-1 overflow-y-auto">
                <SectionPanel v-if="activeTab === 'sections'" />
                <ThemePanel v-if="activeTab === 'theme'" />
                <ExportPanel v-if="activeTab === 'export'" />
            </div>
        </aside>

        <!-- Main panes -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Toolbar -->
            <div class="h-10 border-b border-border bg-bg-2 flex items-center px-4 gap-3 shrink-0">
                <!-- Pane switcher -->
                <div class="flex bg-bg-3 border border-border rounded-lg p-0.5 gap-0.5">
                    <button v-for="m in paneModes" :key="m.id" @click="editor.setPaneMode(m.id)"
                        class="text-xs px-3 py-1 rounded-md transition-all"
                        :class="editor.paneMode === m.id ? 'bg-bg-4 text-white' : 'text-white/30 hover:text-white'">
                        {{ m.label }}
                    </button>
                </div>

                <span class="text-xs text-white/20 font-mono ml-auto">{{ editor.markdown.length }} chars</span>

                <button @click="regenerate" class="btn-ghost text-xs">↺ Regenerate</button>
            </div>

            <!-- Panes -->
            <div class="flex-1 flex overflow-hidden">
                <!-- Editor -->
                <div v-if="editor.paneMode !== 'preview'"
                    class="flex-1 flex flex-col overflow-hidden border-r border-border">
                    <div class="px-4 py-1.5 bg-bg-2 border-b border-border">
                        <span class="text-[10px] font-mono text-white/20 uppercase tracking-widest">Markdown</span>
                    </div>
                    <textarea
                        class="flex-1 bg-bg p-5 font-mono text-sm text-white/80 resize-none outline-none leading-relaxed caret-accent-2"
                        :value="editor.markdown"
                        @input="editor.setMarkdown(($event.target as HTMLTextAreaElement).value)" spellcheck="false"
                        placeholder="Your README markdown appears here…" />
                </div>

                <!-- Preview -->
                <div v-if="editor.paneMode !== 'editor'" class="flex-1 flex flex-col overflow-hidden">
                    <div class="px-4 py-1.5 bg-bg-2 border-b border-border">
                        <span class="text-[10px] font-mono text-white/20 uppercase tracking-widest">Preview</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-8 bg-bg">
                        <div class="max-w-3xl mx-auto md-preview" v-html="renderedHtml" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { useEditorStore } from '../stores/editor'
import { useProfileStore } from '../stores/profile'
import { generateApi } from '../api/generate'
import SectionPanel from '../components/editor/SectionPanel.vue'
import ThemePanel from '../components/editor/ThemePanel.vue'
import ExportPanel from '../components/editor/ExportPanel.vue'

const router = useRouter()
const editor = useEditorStore()
const profile = useProfileStore()

const activeTab = ref('sections')
const generating = ref(false)

const tabs = [
    { id: 'sections', label: 'Sections' },
    { id: 'theme', label: 'Theme' },
    { id: 'export', label: 'Export' }
]

const paneModes = [
    { id: 'split', label: 'Split' },
    { id: 'editor', label: 'Editor' },
    { id: 'preview', label: 'Preview' }
] as const

onMounted(() => {
    if (!profile.data) { router.push('/'); return }
    if (!editor.markdown) regenerate()
})

// In Editor.vue — fix the regenerate function
async function regenerate() {
    if (!profile.data || generating.value) return
    generating.value = true
    try {
        const data = await generateApi.generate({
            username: profile.username,
            templateId: editor.templateId,
            options: { theme: editor.theme, sections: editor.enabledSections }
        })
        editor.setMarkdown(data.content)
    } finally {
        generating.value = false
    }
}

// Auto-regenerate when sections or theme change
watch([() => editor.enabledSections, () => editor.theme], regenerate, { deep: true })

marked.setOptions({ gfm: true, breaks: true })
const renderedHtml = computed(() => {
    if (!editor.markdown) return '<p class="text-white/20 italic">Nothing to preview yet.</p>'
    return DOMPurify.sanitize(marked.parse(editor.markdown) as string, {
        ADD_TAGS: ['img'], ADD_ATTR: ['align', 'src', 'alt', 'height', 'width', 'style']
    })
})
</script>