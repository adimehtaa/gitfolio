<template>
    <aside class="w-52 shrink-0 bg-bg-2 border-r border-border flex flex-col overflow-hidden">
        <div class="p-3 border-b border-border">
            <p class="text-[10px] uppercase tracking-widest text-white/20 font-semibold">Blocks</p>
            <p class="text-[10px] text-white/20 mt-0.5">Click or drag onto canvas</p>
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-0.5">
            <div v-for="block in BLOCK_REGISTRY" :key="block.type" draggable="true"
                @dragstart="builder.draggingType = block.type" @dragend="builder.draggingType = null"
                @click="builder.addBlock(block.type)"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-grab hover:bg-bg-3 transition-colors group select-none">
                <span class="text-base w-5 text-center shrink-0">{{ block.icon }}</span>
                <div class="min-w-0">
                    <p class="text-xs font-medium text-white/70 group-hover:text-white transition-colors truncate">
                        {{ block.label }}
                    </p>
                    <p class="text-[10px] text-white/20 truncate">{{ block.description }}</p>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { BLOCK_REGISTRY } from '../../builder/blockRegistry'
import { useBuilderStore } from '../../stores/builder'

const builder = useBuilderStore()
</script>