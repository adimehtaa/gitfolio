<!-- gitfolio-client/src/views/Templates.vue -->
<template>
    <div class="max-w-7xl mx-auto px-4 py-10">
        <div class="mb-8">
            <h1 class="font-display text-3xl font-bold mb-2">Templates</h1>
            <p class="text-white/40 text-sm">
                {{ auth.isAuthenticated ? 'All templates available.' : '3 free · Sign in for 100+' }}
            </p>
        </div>
        <TemplateGrid @select="onSelect" />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useEditorStore } from '../stores/editor'
import { useProfileStore } from '../stores/profile'
import TemplateGrid from '../components/template/TemplateGrid.vue'

const router = useRouter()
const auth = useAuthStore()
const editor = useEditorStore()
const profile = useProfileStore()

function onSelect(id: string) {
    editor.setTemplate(id)
    // If profile already loaded go straight to editor, else go to home to enter username
    if (profile.data) router.push('/editor')
    else router.push('/')
}
</script>