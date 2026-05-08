<template>
    <div class="flex items-center justify-center" :class="containerClass">
        <div class="rounded-full border-2 border-bg-4 animate-spin" :class="[sizeClass, 'border-t-accent']" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    size?: 'sm' | 'md' | 'lg'
full?: boolean}>(), { size: 'md', full: false })

const sizeClass = computed(() => ({
    sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12'
}[props.size]))

const containerClass = computed(() => props.full ? 'min-h-screen' : '')
</script>