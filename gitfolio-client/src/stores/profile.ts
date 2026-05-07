import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { api } from "../api/client";

export const useProfileStore = defineStore('profile', () => {
    const data = ref<any | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const username = computed(() => data.value?.user?.login || '')
    const displayName = computed(() => data.value?.user?.name || username.value)
    const avatarUrl = computed(() => data.value?.user?.avatar_url || '')

    async function fetch(uname: string) {
        loading.value = true;
        error.value = null;

        try {
            const { data: res } = await api.get(`/profile/${uname}`)
            data.value = res
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to fetch profile'
            data.value = null
        } finally {
            loading.value = false
        }
    }

    function reset() { data.value = null; error.value = null }

    return { data, loading, error, username, displayName, avatarUrl, fetch, reset }

})