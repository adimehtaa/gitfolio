import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { renderBlocks } from '../builder/blockRenderer'
import { getBlockMeta } from '../builder/blockRegistry'
import type { Block, BlockType, BlockConfig } from '../types/builder'

function generateId(): string {
    return Math.random().toString(36).slice(2, 9)
}

export const useBuilderStore = defineStore('builder', () => {
    const blocks = ref<Block[]>([])
    const selectedId = ref<string | null>(null)
    const templateName = ref('My Custom Template')
    const templateDesc = ref('')
    const saving = ref(false)

    // Drag state — what type is being dragged from toolbar
    const draggingType = ref<BlockType | null>(null)
    // Drag state — which block id is being reordered on canvas
    const draggingId = ref<string | null>(null)

    const selected = computed(() =>
        blocks.value.find(b => b.id === selectedId.value) ?? null
    )

    function addBlock(type: BlockType, atIndex?: number) {
        const meta: Block = {
            id: generateId(),
            type,
            config: { ...getBlockMeta(type).defaultConfig },
        }
        if (atIndex !== undefined) {
            blocks.value.splice(atIndex, 0, meta)
        } else {
            blocks.value.push(meta)
        }
        selectedId.value = meta.id
        return meta.id
    }

    function removeBlock(id: string) {
        blocks.value = blocks.value.filter(b => b.id !== id)
        if (selectedId.value === id) selectedId.value = null
    }

    function duplicateBlock(id: string) {
        const idx = blocks.value.findIndex(b => b.id === id)
        if (idx === -1) return
        const clone: Block = {
            ...blocks.value[idx],
            id: generateId(),
            config: { ...blocks.value[idx].config },
        }
        blocks.value.splice(idx + 1, 0, clone)
        selectedId.value = clone.id
    }

    function moveBlock(id: string, direction: 'up' | 'down') {
        const idx = blocks.value.findIndex(b => b.id === id)
        const newIdx = direction === 'up' ? idx - 1 : idx + 1
        if (idx === -1 || newIdx < 0 || newIdx >= blocks.value.length) return
        const arr = [...blocks.value]
            ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
        blocks.value = arr
    }

    function updateConfig(id: string, patch: Partial<BlockConfig>) {
        const block = blocks.value.find(b => b.id === id)
        if (block) block.config = { ...block.config, ...patch }
    }

    function selectBlock(id: string | null) {
        selectedId.value = id
    }

    function setDraggingType(type: BlockType | null) {
        draggingType.value = type
    }

    function setDraggingId(id: string | null) {
        draggingId.value = id
    }

    function reorderTo(draggedId: string, targetId: string) {
        if (draggedId === targetId) return
        const arr = [...blocks.value]
        const from = arr.findIndex(b => b.id === draggedId)
        const to = arr.findIndex(b => b.id === targetId)
        if (from === -1 || to === -1) return
        const [item] = arr.splice(from, 1)
        arr.splice(to, 0, item)
        blocks.value = arr
    }

    function getMarkdown(username: string, profile?: any): string {
        return renderBlocks(blocks.value, username, profile)
    }

    function reset() {
        blocks.value = []
        selectedId.value = null
        templateName.value = 'My Custom Template'
        templateDesc.value = ''
    }

    function loadFromSaved(saved: Block[], name: string, desc = '') {
        blocks.value = saved
        templateName.value = name
        templateDesc.value = desc
        selectedId.value = null
    }

    return {
        blocks, selectedId, selected,
        templateName, templateDesc, saving,
        draggingType, draggingId,
        addBlock, removeBlock, duplicateBlock, moveBlock,
        updateConfig, selectBlock,
        setDraggingType, setDraggingId, reorderTo,
        getMarkdown, reset, loadFromSaved,
    }
})