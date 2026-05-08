<template>
  <header class="sticky top-0 z-50 border-b border-border bg-bg-2/80 backdrop-blur-xl">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 flex-shrink-0">
        <span class="text-accent text-lg">◈</span>
        <span class="font-display font-bold text-sm tracking-tight">ReadmeGen</span>
      </RouterLink>

      <!-- Nav -->
      <nav class="hidden md:flex items-center gap-1">
        <RouterLink
          v-for="link in nav"
          :key="link.path"
          :to="link.path"
          class="text-sm text-white/50 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          active-class="text-white bg-bg-3"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Right -->
      <div class="flex items-center gap-3">
        <template v-if="auth.isAuthenticated">
          <RouterLink to="/dashboard" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img :src="auth.user?.avatarUrl" class="w-7 h-7 rounded-full border border-border-2" />
            <span class="hidden sm:block text-sm font-medium">{{ auth.user?.login }}</span>
          </RouterLink>
          <RouterLink v-if="auth.isAdmin" to="/admin" class="btn-ghost text-accent-2 text-xs">
            Admin
          </RouterLink>
          <button @click="auth.logout()" class="btn-ghost text-xs">Logout</button>
        </template>

        <template v-else>
          <button @click="auth.loginWithGithub()" class="btn-primary text-xs py-2 px-4">
            <GithubIcon :size="14" />
            Sign in
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Github as GithubIcon } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

const nav = [
  { path: '/generate',  label: 'Generate' },
  { path: '/templates', label: 'Templates' },
  { path: '/dashboard', label: 'Dashboard' },
]
</script>