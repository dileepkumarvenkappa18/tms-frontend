import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getTenantUsers, createOrUpdateTenantUser } from '@/services/tenant.service'
import { useAuthStore } from '@/stores/auth'

export const useTenantStore = defineStore('tenant', () => {
  // State
  const users = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const currentTenantId = ref(null)
  const authStore = useAuthStore()
  
  // Actions
  const fetchUsers = async (tenantId, filters = {}) => {
    if (!tenantId) {
      // Try to get tenant ID from auth store if not provided
      tenantId = authStore.tenantId
      if (!tenantId) {
        error.value = 'No tenant ID available'
        return
      }
    }
    
    isLoading.value = true
    error.value = null
    currentTenantId.value = tenantId
    
    try {
      const fetchedUsers = await getTenantUsers(tenantId, filters)
      users.value = fetchedUsers
      return fetchedUsers
    } catch (err) {
      error.value = err.message || 'Failed to fetch users'
      console.error('Failed to fetch users:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  const createOrUpdateUser = async (userData) => {
    if (!currentTenantId.value) {
      currentTenantId.value = authStore.tenantId
      if (!currentTenantId.value) {
        error.value = 'No tenant ID available'
        return null
      }
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const result = await createOrUpdateTenantUser(currentTenantId.value, userData)
      
      // Update local state - add or update user
      const existingIndex = users.value.findIndex(u => u.email === userData.email)
      if (existingIndex >= 0) {
        users.value[existingIndex] = result
      } else {
        users.value.push(result)
      }
      
      return result
    } catch (err) {
      error.value = err.message || 'Failed to create/update user'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Computed properties
  const standardUsersCount = computed(() => 
    users.value.filter(u => u.role === 'StandardUser').length
  )
  
  const monitoringUsersCount = computed(() => 
    users.value.filter(u => u.role === 'MonitoringUser').length
  )
  
  return {
    users,
    isLoading,
    error,
    currentTenantId,
    fetchUsers,
    createOrUpdateUser,
    standardUsersCount,
    monitoringUsersCount
  }
})