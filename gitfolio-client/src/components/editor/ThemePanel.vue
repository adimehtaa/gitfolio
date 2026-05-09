<template>
    <div class="p-3">
        <p class="text-[10px] uppercase tracking-widest text-white/20 mb-3 px-1">Stats theme</p>
        <div class="grid grid-cols-3 gap-2">
            <button v-for="t in themes" :key="t.id" @click="editor.setTheme(t.id)"
                class="rounded-xl border p-2 text-center transition-all" :class="editor.theme === t.id
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-border-2'">
                <div class="w-full aspect-video rounded-lg mb-1.5" :style="{ background: t.preview }"></div>
                <span class="text-[10px] text-white/50">{{ t.label }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '../../stores/editor'

const editor = useEditorStore()

const themes = [
    { id: 'dark', label: 'Dark', preview: 'linear-gradient(135deg,#141418,#1c1c22)' },
    { id: 'light', label: 'Light', preview: 'linear-gradient(135deg,#f0f0f5,#e0e0ea)' },
    { id: 'tokyonight', label: 'Tokyo', preview: 'linear-gradient(135deg,#1a1b2e,#16213e)' },
    { id: 'radical', label: 'Radical', preview: 'linear-gradient(135deg,#141321,#2d1b54)' },
    { id: 'merko', label: 'Merko', preview: 'linear-gradient(135deg,#0a3b2e,#071a14)' },
    { id: 'gruvbox', label: 'Gruvbox', preview: 'linear-gradient(135deg,#282828,#3c3836)' },
    { id: 'cobalt', label: 'Cobalt', preview: 'linear-gradient(135deg,#193549,#122637)' },
    { id: 'dracula', label: 'Dracula', preview: 'linear-gradient(135deg,#282a36,#1e2029)' },
    { id: 'synthwave', label: 'Synth', preview: 'linear-gradient(135deg,#2b213a,#1a1030)' },
]
</script>