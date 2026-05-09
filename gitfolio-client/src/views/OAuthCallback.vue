<!-- gitfolio-client/src/views/OAuthCallback.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <div class="w-10 h-10 border-2 border-bg-4 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p class="text-white/40 text-sm">{{ message }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const message = ref('Signing you in…')

onMounted(async () => {
    const token = route.query.token as string
    const error = route.query.error as string

    if (error) {
        message.value = `Login failed: ${error}`
        setTimeout(() => router.push('/'), 3000)
        return
    }
    if (!token) {
        message.value = 'No token received.'
        setTimeout(() => router.push('/'), 3000)
        return
    }

    auth.setToken(token)
    await auth.fetchMe()
    message.value = `Welcome, ${auth.user?.login}!`
    setTimeout(() => router.push('/dashboard'), 800)
})
</script>