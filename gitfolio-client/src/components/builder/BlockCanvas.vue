<template>
    <div class="flex-1 overflow-y-auto p-6" @dragover.prevent="canvasDragOver = true"
        @dragleave="canvasDragOver = false" @drop.prevent="onCanvasDrop">
        <!-- Empty state -->
        <div v-if="builder.blocks.length === 0"
            class="h-full min-h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl text-center p-12 transition-all"
            :class="canvasDragOver ? 'border-accent/60 bg-accent/5' : 'border-border'">
            <span class="text-4xl mb-4 opacity-20">◈</span>
            <p class="text-white/30 text-sm font-medium">Drag blocks from the sidebar</p>
            <p class="text-white/15 text-xs mt-1">or click any block to add it</p>
        </div>

        <!-- Block list -->
        <div v-else class="max-w-2xl mx-auto space-y-2">
            <BlockItem v-for="(block, idx) in builder.blocks" :key="block.id" :block="block" :index="idx"
                :selected="builder.selectedId === block.id" @select="builder.selectBlock(block.id)"
                @remove="builder.removeBlock(block.id)" @duplicate="builder.duplicateBlock(block.id)"
                @move-up="builder.moveBlock(block.id, 'up')" @move-down="builder.moveBlock(block.id, 'down')"
                @drag-start="builder.setDraggingId(block.id)" @drag-end="builder.setDraggingId(null)"
                @drop-on="onBlockDrop(block.id)" />

            <!-- Bottom drop zone -->
            <div class="h-12 flex items-center justify-center border-2 border-dashed rounded-xl transition-all"
                :class="canvasDragOver ? 'border-accent/40 bg-accent/5' : 'border-transparent'"
                @dragover.prevent="canvasDragOver = true" @drop.prevent="onCanvasDrop">
                <p v-if="canvasDragOver" class="text-xs text-accent-2">Drop here to add at end</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBuilderStore } from '../../stores/builder'
import BlockItem from './BlockItem.vue'

const builder = useBuilderStore()
const canvasDragOver = ref(false)

function onCanvasDrop() {
    canvasDragOver.value = false
    if (builder.draggingType) {
        builder.addBlock(builder.draggingType)
        builder.draggingType = null
    }
}

function onBlockDrop(targetId: string) {
    if (builder.draggingId) {
        builder.reorderTo(builder.draggingId, targetId)
        builder.setDraggingId(null)
    } else if (builder.draggingType) {
        const idx = builder.blocks.findIndex(b => b.id === targetId)
        builder.addBlock(builder.draggingType, idx)
        builder.draggingType = null
    }
}
</script>