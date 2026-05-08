<template>
    <button @click="$emit('select', template.id)"
        class="group text-left card p-4 hover:border-border-2 transition-all duration-200 hover:-translate-y-0.5"
        :class="{ 'border-accent shadow-lg shadow-accent/10': selected }">
        <!-- Preview image / placeholder -->
        <div class="w-full aspect-video bg-bg-3 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
            <img v-if="template.previewImage" :src="template.previewImage" :alt="template.name"
                class="w-full h-full object-cover" />
            <span v-else class="text-3xl text-white/10">◈</span>
        </div>

        <!-- Info -->
        <div class="flex items-start justify-between gap-2">
            <div>
                <h3 class="text-sm font-semibold text-white group-hover:text-accent-2 transition-colors">
                    {{ template.name }}
                </h3>
                <p class="text-xs text-white/40 mt-0.5 line-clamp-2">{{ template.description }}</p>
            </div>
            <span :class="template.tier === 'free' ? 'badge-free' : 'badge-premium'" class="badge flex-shrink-0">
                {{ template.tier }}
            </span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1 mt-2.5">
            <span v-for="tag in template.tags?.slice(0, 3)" :key="tag"
                class="text-[10px] text-white/30 bg-bg-3 px-2 py-0.5 rounded-full">
                {{ tag }}
            </span>
        </div>

        <!-- Usage -->
        <p v-if="template.usageCount" class="text-[10px] text-white/20 mt-2">
            {{ template.usageCount.toLocaleString() }} uses
        </p>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    template: any
    selected?: boolean
}>()
defineEmits<{ select: [id: string] }>()
</script>