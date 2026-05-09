<!-- gitfolio-client/src/views/Generator.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <!-- Profile chip -->
    <div class="flex items-center gap-4 mb-8">
      <img :src="profile.avatarUrl" class="w-10 h-10 rounded-full border border-border-2" />
      <div>
        <h1 class="font-semibold text-sm">{{ profile.displayName }}</h1>
        <p class="text-xs text-white/40 font-mono">@{{ profile.username }}</p>
      </div>
      <button @click="profile.reset(); router.push('/')" class="btn-ghost ml-auto text-xs">
        ← Change user
      </button>
    </div>

    <h2 class="font-display text-2xl font-bold mb-2">Choose a template</h2>
    <p class="text-white/40 text-sm mb-8">
      {{ auth.isAuthenticated ? 'All templates available.' : '3 free templates · Sign in for 100+' }}
    </p>

    <TemplateGrid @select="onTemplateSelect" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '../stores/profile'
import { useAuthStore } from '../stores/auth'
import { useEditorStore } from '../stores/editor'
import TemplateGrid from '../components/template/TemplateGrid.vue'

const router = useRouter()
const profile = useProfileStore()
const auth = useAuthStore()
const editor = useEditorStore()

onMounted(() => { if (!profile.data) router.push('/') })

function onTemplateSelect(id: string) {
  editor.setTemplate(id)
  router.push('/editor')
}
</script>