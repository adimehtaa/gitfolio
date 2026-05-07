import { defineStore } from "pinia"
import { computed, ref } from "vue"


export const ALL_SECTIONS = [
    {
        id: 'header',
        label: 'Header & Bio',
        icon: '◉'
    },
    {
        id: 'stats',
        label: 'GitHub Stats',
        icon: '◈'
    },
    {
        id: 'streak',
        label: 'Streak Stats',
        icon: '◆'
    },
    {
        id: 'languages',
        label: 'Top Languages',
        icon: '◇'
    },
    {
        id: 'projects',
        label: 'Featured Projects',
        icon: '▣'
    },
    {
        id: 'skills',
        label: 'Tech Stack',
        icon: '▦'
    },
    {
        id: 'contributions',
        label: 'Contribution Graph',
        icon: '▤',
    },
    {
        id: 'social',
        label: 'Social Links',
        icon: '◎'
    },
    {
        id: 'visitors',
        label: 'Visitor Counter',
        icon: '◌'
    },
]

export const useEditorStore = defineStore('editor', () => {
    const markdown = ref('')
    const templateId = ref('minimal')
    const theme = ref('dark')
    const sections = ref(ALL_SECTIONS.map(s => ({
        ...s,
        enabled: ['header', 'stats', 'projects', 'skills', 'social'].includes(s.id)
    })))

    const isDirty = ref(false)
    const paneMode = ref<'split' | 'editor' | 'preview'>('split');

    const enabledSections = computed(() => sections.value.filter(s => s.enabled).map(s => s.id));

    function setMarkdown(md: string) {
        markdown.value = md;
        isDirty.value = true;
    }

    function setTemplate(id: string) {
        templateId.value = id
    }

    function setTheme(t: string) {
        theme.value = t;
    }

    function setPaneMode(m: typeof paneMode.value) {
        paneMode.value = m;
    }

    function toggleSection(id: string) {
        const s = sections.value.find(s => s.id === id)
        if (s) s.enabled = !s.enabled
    }

    function reorderSections(newOrder: typeof sections.value) {
        sections.value = newOrder
    }

    function markSaved() {
        isDirty.value = false
    }

    function reset() {
        markdown.value = '';
        isDirty.value = false;

    }

    return {
        markdown,
        templateId,
        theme,
        sections,
        isDirty,
        paneMode,
        enabledSections,
        setMarkdown,
        setTemplate,
        setTheme,
        setPaneMode,
        toggleSection,
        reorderSections,
        markSaved,
        reset
    }

})