<template>
  <main class="relative overflow-hidden">
    <!-- Grid background -->
    <div class="pointer-events-none fixed inset-0 opacity-30"
         style="background-image: linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:60px 60px">
    </div>

    <!-- Hero -->
    <section class="relative max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
      <div class="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
        <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse-slow"></span>
        Free to use · No signup required to generate
      </div>

      <h1 class="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
        Build a
        <span class="bg-linear-to-r from-accent-2 to-pink-400 bg-clip-text text-transparent">
          stunning
        </span>
        <br/>GitHub profile
      </h1>

      <p class="text-lg text-white/50 max-w-xl mx-auto mb-12 leading-relaxed">
        Enter any GitHub username, pick a template, customize sections, and export your
        <code class="text-accent-2 bg-bg-3 px-1.5 py-0.5 rounded text-sm">README.md</code> in seconds.
      </p>

      <!-- Input -->
      <form @submit.prevent="handleGenerate" class="max-w-lg mx-auto mb-6">
        <div class="flex gap-2 bg-bg-2 border border-border-2 rounded-2xl p-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
          <span class="flex items-center pl-3 text-white/30 font-mono text-sm shrink-0">@</span>
          <input
            v-model="username"
            type="text"
            placeholder="github-username"
            autocomplete="off"
            spellcheck="false"
            :disabled="loading"
            class="flex-1 bg-transparent outline-none text-white placeholder-white/20 font-mono text-sm py-2"
          />
          <button type="submit" :disabled="!username.trim() || loading" class="btn-primary rounded-xl py-2.5 px-6 shrink-0">
            <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
            <span v-else>Generate →</span>
          </button>
        </div>
        <p v-if="error" class="text-red-400 text-xs mt-2 font-mono">{{ error }}</p>
      </form>

      <!-- Or sign in -->
      <div class="flex items-center gap-4 justify-center text-white/20 text-sm">
        <div class="h-px bg-border flex-1 max-w-24"></div>
        or
        <div class="h-px bg-border flex-1 max-w-24"></div>
      </div>
      <button
        v-if="!auth.isAuthenticated"
        @click="auth.loginWithGithub()"
        class="btn-secondary mt-4 mx-auto"
      >
        <GithubIcon :size="16" />
        Sign in to unlock all templates + backup
      </button>
    </section>

    <!-- Feature grid -->
    <section class="max-w-5xl mx-auto px-4 pb-24">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="f in features" :key="f.title" class="card p-5 hover:border-border-2 transition-colors">
          <span class="text-2xl block mb-3">{{ f.icon }}</span>
          <h3 class="font-semibold text-sm mb-1.5">{{ f.title }}</h3>
          <p class="text-xs text-white/40 leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Github as GithubIcon } from 'lucide-vue-next'
import { useProfileStore } from '../stores/profile'
import { useAuthStore } from '../stores/auth'
import { useEditorStore } from '../stores/editor'

const router  = useRouter()
const profile = useProfileStore()
const auth    = useAuthStore()
const editor  = useEditorStore()

const username = ref('')
const loading  = ref(false)
const error    = ref('')

async function handleGenerate() {
  const uname = username.value.trim()
  if (!uname) return
  loading.value = true
  error.value   = ''
  await profile.fetch(uname)
  if (profile.error) { error.value = profile.error; loading.value = false; return }
  router.push('/generate')
}

const features = [
  { icon: '◈', title: '100+ Templates', desc: 'Free templates for everyone. Premium unlocked with a GitHub login.' },
  { icon: '◆', title: 'Live Preview', desc: 'See your README render in real-time as you edit sections.' },
  { icon: '▣', title: 'Custom Builder', desc: 'Logged-in users can drag and drop blocks to create their own template.' },
  { icon: '⇡', title: 'One-click Push', desc: 'Push your README directly to your GitHub profile repository.' },
]
</script>