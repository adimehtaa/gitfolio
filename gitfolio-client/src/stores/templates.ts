import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { templatesApi } from "../api/templates";


export const useTemplatesStore = defineStore('templates', () => {

    const all = ref<any[]>([]);
    const loading = ref(false);
    const selected = ref<string | null>(null)
    const filter = ref({
        category: '',
        tier: ''
    })


    const filtered = computed(() => {
        return all.value.filter(t => {
            if (filter.value.category && t.category !== filter.value.category) return false
            if (filter.value.tier && t.tier !== filter.value.tier) return false
            return true
        })
    })

    const categories = computed(() => [...new Set(all.value.map(t => t.category))])

    async function fetchAll() {
        loading.value = true
        try {
            all.value = await templatesApi.list()
        } finally {
            loading.value = false
        }
    }

    function setFilter(f: Partial<typeof filter.value>) {
        Object.assign(filter.value, f)
    }

    function select(id: string) { selected.value = id }

    return {
        all,
        loading,
        selected,
        filter,
        filtered,
        categories,
        fetchAll,
        setFilter,
        select
    }
})