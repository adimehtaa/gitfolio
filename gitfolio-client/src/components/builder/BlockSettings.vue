<!-- gitfolio-client/src/components/builder/BlockSettings.vue -->
<template>
    <aside class="w-64 shrink-0 border-l border-border bg-bg-2 flex flex-col overflow-hidden"
        :class="{ 'opacity-50 pointer-events-none': !selected }">
        <!-- Header -->
        <div class="px-4 py-2 border-b border-border flex items-center gap-2">
            <span class="text-[10px] font-mono uppercase tracking-widest text-white/20 flex-1">
                {{ selected ? selected.type : 'Settings' }}
            </span>
            <button v-if="selected" @click="builder.removeBlock(selected.id)"
                class="text-white/20 hover:text-red-400 transition-colors text-xs" title="Remove block">
                ✕
            </button>
        </div>

        <!-- Empty state -->
        <div v-if="!selected" class="flex-1 flex items-center justify-center p-6">
            <p class="text-white/20 text-xs text-center leading-relaxed">
                Select a block on the canvas to edit its settings
            </p>
        </div>

        <!-- Settings form -->
        <div v-else class="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

            <!-- Label / Heading text -->
            <div v-if="hasField('label')" class="field">
                <label class="field-label">Label</label>
                <input v-model="selected.config.label" class="field-input" placeholder="Block label…" />
            </div>

            <!-- Text / content body -->
            <div v-if="hasField('text')" class="field">
                <label class="field-label">Text</label>
                <textarea v-model="selected.config.text" rows="4" class="field-input resize-none"
                    placeholder="Block content…" />
            </div>

            <!-- URL -->
            <div v-if="hasField('url')" class="field">
                <label class="field-label">URL</label>
                <input v-model="selected.config.url" class="field-input" placeholder="https://…" />
            </div>

            <!-- Alt text (images) -->
            <div v-if="hasField('alt')" class="field">
                <label class="field-label">Alt text</label>
                <input v-model="selected.config.alt" class="field-input" placeholder="Image description…" />
            </div>

            <!-- Width / Height (images, badges) -->
            <div v-if="hasField('width') || hasField('height')" class="flex gap-2">
                <div v-if="hasField('width')" class="field flex-1">
                    <label class="field-label">Width</label>
                    <input v-model="selected.config.width" class="field-input" placeholder="auto" />
                </div>
                <div v-if="hasField('height')" class="field flex-1">
                    <label class="field-label">Height</label>
                    <input v-model="selected.config.height" class="field-input" placeholder="auto" />
                </div>
            </div>

            <!-- Align -->
            <div v-if="hasField('align')" class="field">
                <label class="field-label">Align</label>
                <div class="flex gap-1">
                    <button v-for="a in ['left', 'center', 'right']" :key="a" @click="selected.config.align = a"
                        class="flex-1 py-1 rounded text-xs border transition-colors" :class="selected.config.align === a
                            ? 'bg-accent border-accent text-white'
                            : 'border-border text-white/40 hover:text-white/70'">
                        {{ a[0].toUpperCase() + a.slice(1) }}
                    </button>
                </div>
            </div>

            <!-- Level (headings) -->
            <div v-if="hasField('level')" class="field">
                <label class="field-label">Heading level</label>
                <div class="flex gap-1">
                    <button v-for="n in [1, 2, 3, 4]" :key="n" @click="selected.config.level = n"
                        class="flex-1 py-1 rounded text-xs border transition-colors" :class="selected.config.level === n
                            ? 'bg-accent border-accent text-white'
                            : 'border-border text-white/40 hover:text-white/70'">
                        H{{ n }}
                    </button>
                </div>
            </div>

            <!-- Boolean toggles -->
            <template v-for="toggle in booleanToggles" :key="toggle.key">
                <div v-if="hasField(toggle.key)" class="field">
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                        <div class="w-8 h-4 rounded-full transition-colors relative"
                            :class="(selected.config as any)[toggle.key] ? 'bg-accent' : 'bg-white/10'"
                            @click="(selected.config as any)[toggle.key] = !(selected.config as any)[toggle.key]">
                            <div class="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform"
                                :class="(selected.config as any)[toggle.key] ? 'translate-x-4' : 'translate-x-0'" />
                        </div>
                        <span class="field-label mb-0">{{ toggle.label }}</span>
                    </label>
                </div>
            </template>

            <!-- Divider style -->
            <div v-if="selected.type === 'divider'" class="field">
                <label class="field-label">Style</label>
                <select v-model="selected.config.dividerStyle" class="field-input">
                    <option value="line">Solid line</option>
                    <option value="thick">Thick line</option>
                </select>
            </div>

            <!-- Raw markdown fallback -->
            <div v-if="hasField('markdown')" class="field">
                <label class="field-label">Raw Markdown</label>
                <textarea v-model="selected.config.content" rows="6"
                    class="field-input font-mono resize-none text-[11px]" placeholder="Enter raw markdown…" />
            </div>

            <!-- Block order controls -->
            <div class="pt-2 border-t border-border flex gap-2">
                <button @click="builder.moveBlock(selected.id, -1)" class="flex-1 btn-ghost text-xs py-1"
                    :disabled="isFirst">↑ Move
                    up</button>
                <button @click="builder.moveBlock(selected.id, 1)" class="flex-1 btn-ghost text-xs py-1"
                    :disabled="isLast">↓ Move
                    down</button>
            </div>

            <!-- Duplicate -->
            <button @click="builder.duplicateBlock(selected.id)" class="btn-ghost text-xs py-1 w-full">
                ⎘ Duplicate block
            </button>

        </div>
    </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBuilderStore } from '../../stores/builder'

const builder = useBuilderStore()

const selected = computed(() => {
    if (!builder.selectedId) return null
    return builder.blocks.find(b => b.id === builder.selectedId) ?? null
})

const selectedIndex = computed(() =>
    builder.blocks.findIndex(b => b.id === builder.selectedId)
)
const isFirst = computed(() => selectedIndex.value === 0)
const isLast = computed(() => selectedIndex.value === builder.blocks.length - 1)

/** Check if the selected block exposes a given prop key */
function hasField(key: string): boolean {
    return selected.value ? key in (selected.value.config ?? {}) : false
}

const booleanToggles: { key: string; label: string }[] = [
    { key: 'showIcon', label: 'Show icon' },
    { key: 'compact', label: 'Compact' },
    { key: 'numbered', label: 'Numbered list' },
    { key: 'collapsible', label: 'Collapsible section' },
    { key: 'rounded', label: 'Rounded corners' },
]
</script>

<style scoped>
.field {
    @apply flex flex-col gap-1;
}

.field-label {
    @apply text-[10px] font-mono uppercase tracking-widest text-white/30 mb-0.5;
}

.field-input {
    @apply w-full bg-bg border border-border rounded px-2 py-1.5 text-xs text-white outline-none focus:border-accent transition-colors placeholder-white/20;
}
</style>