<template>
  <div class="p-3 space-y-1">
    <p class="text-[10px] uppercase tracking-widest text-white/20 mb-3 px-1">Drag to reorder</p>
    <div
      class="space-y-1"
      @dragover.prevent
      @drop="onDrop"
    >
      <div
        v-for="section in editor.sections"
        :key="section.id"
        draggable="true"
        @dragstart="dragId = section.id"
        @dragover.prevent="overId = section.id"
        @dragend="dragId = null; overId = null"
        class="flex items-center gap-2.5 px-2 py-2 rounded-xl cursor-default transition-all"
        :class="{
          'opacity-40': dragId === section.id,
          'bg-bg-3': overId === section.id && dragId !== section.id,
          'hover:bg-bg-3': true,
        }"
      >
        <span class="text-white/20 cursor-grab text-xs select-none">⠿</span>
        <span class="text-sm">{{ section.icon }}</span>
        <span class="flex-1 text-xs text-white/60">{{ section.label }}</span>
        <!-- Toggle -->
        <button
          @click="editor.toggleSection(section.id)"
          class="w-8 h-4.5 rounded-full border transition-all shrink-0 relative"
          :class="section.enabled
            ? 'bg-accent border-accent'
            : 'bg-bg-4 border-border-2'"
        >
          <span
            class="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
            :class="section.enabled ? 'left-4.5' : 'left-0.5'"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '../../stores/editor'

const editor = useEditorStore()
const dragId = ref<string | null>(null)
const overId = ref<string | null>(null)

function onDrop() {
  if (!dragId.value || !overId.value || dragId.value === overId.value) return
  const arr = [...editor.sections]
  const fi  = arr.findIndex(s => s.id === dragId.value)
  const ti  = arr.findIndex(s => s.id === overId.value)
  const [moved] = arr.splice(fi, 1)
  arr.splice(ti, 0, moved)
  editor.reorderSections(arr)
}
</script>