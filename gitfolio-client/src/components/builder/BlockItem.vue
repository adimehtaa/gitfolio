<template>
    <div class="group relative border rounded-2xl transition-all duration-150 cursor-pointer" :class="[
        selected ? 'border-accent bg-accent/5' : 'border-border hover:border-border-2 bg-bg-2',
        isDragging ? 'opacity-40 scale-95' : '',
        isDropTarget ? 'border-accent/50 bg-accent/5 scale-[1.01]' : '',
    ]" draggable="true" @dragstart.stop="onDragStart" @dragend.stop="onDragEnd"
        @dragover.prevent.stop="isDropTarget = true" @dragleave.stop="isDropTarget = false" @drop.prevent.stop="onDrop"
        @click="$emit('select')">
        <!-- Header bar -->
        <div class="flex items-center gap-2 px-3 py-2.5 border-b border-border/50">
            <span class="text-sm">{{ meta.icon }}</span>
            <span class="text-xs font-semibold text-white/60 flex-1">{{ meta.label }}</span>

            <!-- Action buttons — visible on hover -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button v-if="index > 0" @click.stop="$emit('move-up')"
                    class="btn-ghost p-1 h-auto text-white/30 hover:text-white" title="Move up">↑</button>
                <button @click.stop="$emit('move-down')" class="btn-ghost p-1 h-auto text-white/30 hover:text-white"
                    title="Move down">↓</button>
                <button @click.stop="$emit('duplicate')" class="btn-ghost p-1 h-auto text-white/30 hover:text-white"
                    title="Duplicate">⎘</button>
                <button @click.stop="$emit('remove')" class="btn-ghost p-1 h-auto text-white/30 hover:text-red-400"
                    title="Remove">✕</button>
            </div>
            <span class="text-white/20 cursor-grab select-none ml-1 text-sm">⠿</span>
        </div>

        <!-- Markdown snippet preview -->
        <div class="px-4 py-3">
            <p class="text-[11px] font-mono text-white/25 line-clamp-3 leading-relaxed whitespace-pre-wrap break-all">
                {{ previewSnippet }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getBlockMeta } from '../../builder/blockRegistry'
import { renderBlock } from '../../builder/blockRenderer'
import { useProfileStore } from '../../stores/profile'
import type { Block } from '../../types/builder'

const props = defineProps<{ block: Block; index: number; selected: boolean }>()
const emit = defineEmits(['select', 'remove', 'duplicate', 'move-up', 'move-down', 'drag-start', 'drag-end', 'drop-on'])

const profile = useProfileStore()
const isDragging = ref(false)
const isDropTarget = ref(false)

const meta = computed(() => getBlockMeta(props.block.type))
const previewSnippet = computed(() => {
    const md = renderBlock(props.block, profile.username || 'username', profile.data)
    return md.slice(0, 200) + (md.length > 200 ? '…' : '')
})

function onDragStart() { isDragging.value = true; emit('drag-start') }
function onDragEnd() { isDragging.value = false; isDropTarget.value = false; emit('drag-end') }
function onDrop() { isDropTarget.value = false; emit('drop-on') }
</script>