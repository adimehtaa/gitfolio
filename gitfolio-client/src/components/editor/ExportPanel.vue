<template>
    <div class="p-3 space-y-2">
        <p class="text-[10px] uppercase tracking-widest text-white/20 mb-3 px-1">Export</p>

        <button @click="copy" class="w-full btn-secondary justify-start gap-3 rounded-xl"
            :class="{ 'text-green-400 border-green-500/30': copied }">
            <CopyIcon :size="14" />
            {{ copied ? 'Copied!' : 'Copy Markdown' }}
        </button>

        <button @click="download" class="w-full btn-secondary justify-start gap-3 rounded-xl">
            <DownloadIcon :size="14" />
            Download .md
        </button>

        <template v-if="auth.isAuthenticated">
            <button @click="save" :disabled="saving" class="w-full btn-secondary justify-start gap-3 rounded-xl">
                <SaveIcon :size="14" />
                {{ saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save to Dashboard' }}
            </button>

            <button @click="push" :disabled="pushing" class="w-full btn-primary justify-start gap-3 rounded-xl">
                <span v-if="pushing"
                    class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <UploadIcon v-else :size="14" />
                {{ pushing ? 'Pushing…' : pushed ? 'Pushed! ✓' : 'Push to GitHub' }}
            </button>
        </template>

        <button v-else @click="auth.loginWithGithub()"
            class="w-full btn-ghost text-xs text-accent-2 justify-start gap-2 rounded-xl border border-accent/20 bg-accent/5">
            <GithubIcon :size="13" />
            Login to save & push
        </button>

        <p v-if="pushUrl" class="text-[10px] text-green-400 font-mono px-1 break-all">
            ✓ {{ pushUrl }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Copy as CopyIcon, Download as DownloadIcon, Save as SaveIcon, Upload as UploadIcon, Github as GithubIcon } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useEditorStore } from '../../stores/editor'
import { useAuthStore } from '../../stores/auth'
import { useProfileStore } from '../../stores/profile'
import { savedApi } from '../../api/saved'
import { api } from '../../api/client'

const editor = useEditorStore()
const auth = useAuthStore()
const profile = useProfileStore()
const toast = useToast()

const copied = ref(false)
const saving = ref(false)
const saved = ref(false)
const pushing = ref(false)
const pushed = ref(false)
const pushUrl = ref('')

async function copy() {
    await navigator.clipboard.writeText(editor.markdown)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
}

function download() {
    const blob = new Blob([editor.markdown], { type: 'text/markdown' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'README.md' })
    a.click(); URL.revokeObjectURL(a.href)
}

async function save() {
    saving.value = true
    try {
        await savedApi.create({
            name: `${profile.username} README`,
            content: editor.markdown,
            githubUsername: profile.username,
            templateId: editor.templateId,
        })
        saved.value = true
        toast.success('README saved to dashboard!')
        setTimeout(() => { saved.value = false }, 3000)
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Save failed')
    } finally {
        saving.value = false
    }
}

async function push() {
    pushing.value = true
    try {
        const { data } = await api.post('/push', { readme: editor.markdown })
        pushed.value = true
        pushUrl.value = data.url
        toast.success('README pushed to GitHub!')
    } catch (e: any) {
        toast.error(e.response?.data?.message || 'Push failed')
    } finally {
        pushing.value = false
    }
}
</script>