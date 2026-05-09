<!-- gitfolio-client/src/views/admin/AdminUsers.vue -->
<template>
    <div class="max-w-5xl mx-auto px-4 py-10">
        <div class="flex items-center justify-between mb-8">
            <h1 class="font-display text-2xl font-bold">Users</h1>
            <RouterLink to="/admin" class="btn-ghost text-xs">← Admin</RouterLink>
        </div>

        <!-- Search -->
        <div class="mb-6">
            <input v-model="search" @input="debouncedFetch" class="input max-w-sm"
                placeholder="Search by login or email…" />
        </div>

        <div v-if="loading" class="flex justify-center py-20">
            <div class="w-8 h-8 border-2 border-bg-4 border-t-accent rounded-full animate-spin" />
        </div>

        <div v-else>
            <div class="card overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-border text-white/30 text-xs uppercase tracking-widest">
                            <th class="text-left p-4">User</th>
                            <th class="text-left p-4">Email</th>
                            <th class="text-left p-4">Role</th>
                            <th class="text-left p-4">Joined</th>
                            <th class="text-right p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id"
                            class="border-b border-border/50 hover:bg-bg-3/50 transition-colors">
                            <td class="p-4">
                                <div class="flex items-center gap-3">
                                    <img :src="user.avatarUrl" class="w-7 h-7 rounded-full" />
                                    <span class="font-mono text-xs">{{ user.login }}</span>
                                </div>
                            </td>
                            <td class="p-4 text-xs text-white/40">{{ user.email || '—' }}</td>
                            <td class="p-4">
                                <span class="badge text-[10px]"
                                    :class="user.role === 'ADMIN' ? 'badge-premium' : 'badge-free'">
                                    {{ user.role }}
                                </span>
                            </td>
                            <td class="p-4 text-xs text-white/40">{{ new Date(user.createdAt).toLocaleDateString() }}
                            </td>
                            <td class="p-4 text-right">
                                <div class="flex items-center gap-2 justify-end">
                                    <button @click="toggleRole(user)"
                                        class="btn-ghost text-xs py-1 px-2 border border-border">
                                        {{ user.role === 'ADMIN' ? 'Demote' : 'Make Admin' }}
                                    </button>
                                    <button @click="deleteUser(user)"
                                        class="btn-ghost text-xs py-1 px-2 text-red-400 hover:text-red-300">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
                <button v-for="p in totalPages" :key="p" @click="page = p; fetchUsers()"
                    class="w-8 h-8 text-xs rounded-lg border transition-all"
                    :class="page === p ? 'bg-accent border-accent text-white' : 'border-border text-white/30 hover:text-white'">
                    {{ p }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { adminApi } from '../../api/admin'

const toast = useToast()
const users = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const page = ref(1)
const totalPages = ref(1)

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => { page.value = 1; fetchUsers() }, 400)
}

async function fetchUsers() {
    loading.value = true
    try {
        const { data } = await adminApi.users(page.value, search.value)
        users.value = data.users
        totalPages.value = data.pages
    } finally {
        loading.value = false
    }
}

async function toggleRole(user: any) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
    if (!confirm(`Change ${user.login} to ${newRole}?`)) return
    try {
        await adminApi.setRole(user.id, newRole)
        user.role = newRole
        toast.success(`${user.login} is now ${newRole}`)
    } catch { toast.error('Failed to update role') }
}

async function deleteUser(user: any) {
    if (!confirm(`Delete ${user.login}? This cannot be undone.`)) return
    try {
        await adminApi.deleteUser(user.id)
        users.value = users.value.filter(u => u.id !== user.id)
        toast.success('User deleted.')
    } catch { toast.error('Failed to delete user') }
}

onMounted(fetchUsers)
</script>