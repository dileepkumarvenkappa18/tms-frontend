import api from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'

/**
 * Get tenants for selection (used in tenant selection screen)
 * @returns {Promise} - Promise with tenant list
 */
export const getTenantsForSelection = async () => {
  try {
    console.log('📡 Fetching tenants for selection')
    const response = await api.get('/v1/tenants/selection') // adjust endpoint if backend differs
    console.log('✅ Tenants fetched:', response.data)

    // Handle data structure (array or wrapped in {data:[]})
    if (Array.isArray(response.data)) {
      return response.data
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data
    } else {
      console.warn('⚠️ Unexpected tenants response format:', response.data)
      return []
    }
  } catch (error) {
    console.error('❌ Error fetching tenants for selection:', error)
    console.error('Error response:', error.response?.data)
    return []
  }
}

/**
 * Get all temples for a tenant
 * @param {string|number} tenantId - The tenant ID
 * @returns {Promise} - Promise with temple data
 */
export const getTemples = async (tenantId) => {
  try {
    console.log('📡 Making API call to fetch available temples')
    console.log('🔍 Search params:', { tenantId, headers: api.defaults.headers.common })

    // Get current URL path to determine context
    const currentPath = window.location.pathname
    console.log('📍 Current path:', currentPath)

    // Set the tenant ID header if provided
    if (tenantId) {
      api.defaults.headers.common['X-Tenant-ID'] = tenantId
    }

    // Get auth store to check user role
    const authStore = useAuthStore()
    const userRole = (authStore.userRole || '').toLowerCase()
    const isMonitoringUser = userRole.includes('monitoring') || userRole.includes('monitoringuser')
    const isStandardUser = userRole.includes('standard') || userRole.includes('standarduser')

    // Different endpoints based on the context
    let endpoint = '/v1/entities'

    if ((isMonitoringUser || isStandardUser) && tenantId) {
      console.log('🔒 Standard/Monitoring user accessing temples for tenant ID:', tenantId)
      endpoint = '/v1/entities'
    } else if (tenantId) {
      console.log('🔒 Using admin endpoint: /v1/entities')
      endpoint = '/v1/entities'
    } else {
      console.log('👤 Using user endpoint: /v1/entities/available')
      endpoint = '/v1/entities/available'
    }

    console.log(`🔍 Making GET request to: ${endpoint}`)
    const response = await api.get(endpoint)

    // Handle various response formats
    let temples = response.data
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      temples = response.data.data
    } else if (!Array.isArray(temples)) {
      console.warn('⚠️ Unexpected response format:', response.data)
      temples = []
    }

    console.log(`✅ Received ${temples.length} temples:`, temples)
    return temples
  } catch (error) {
    console.error('❌ Error fetching temples:', error)
    console.error('Error response:', error.response?.data)
    return []
  }
}

/**
 * Get a specific temple by ID
 */
export const getTempleById = async (id) => {
  try {
    console.log(`📡 Fetching temple with ID: ${id}`)
    const response = await api.get(`/v1/entities/${id}`)
    console.log('📥 Temple details response:', response.data)
    return response.data
  } catch (error) {
    console.error(`❌ Error fetching temple ID ${id}:`, error)
    console.error('Error response:', error.response?.data)
    throw error
  }
}

/**
 * Create a new temple
 */
export const createTemple = async (templeData) => {
  try {
    const response = await api.post('/v1/entities', templeData)
    return response.data
  } catch (error) {
    console.error('Error creating temple:', error)
    throw error
  }
}

/**
 * Update an existing temple
 */
export const updateTemple = async (id, templeData) => {
  try {
    const response = await api.put(`/v1/entities/${id}`, templeData)
    return response.data
  } catch (error) {
    console.error('Error updating temple:', error)
    throw error
  }
}

/**
 * Delete a temple
 */
export const deleteTemple = async (id) => {
  try {
    const response = await api.delete(`/v1/entities/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting temple:', error)
    throw error
  }
}

/**
 * Get users for a tenant
 * @param {string|number} tenantId - The tenant ID
 * @param {object} filters - Optional filters (role, name)
 * @returns {Promise} - Promise with user data
 */
export const getTenantUsers = async (tenantId, filters = {}) => {
  try {
    console.log('📡 Fetching tenant users')
    
    // Build query parameters
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.name) params.append('name', filters.name);
    
    const queryString = params.toString();
    const endpoint = `/v1/tenants/${tenantId}/user/management${queryString ? `?${queryString}` : ''}`;
    
    console.log(`🔍 Making GET request to: ${endpoint}`);
    const response = await api.get(endpoint);
    
    let users = response.data;
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      users = response.data.data;
    }
    
    console.log(`✅ Received ${users.length} users:`, users);
    return users;
  } catch (error) {
    console.error('❌ Error fetching tenant users:', error);
    console.error('Error response:', error.response?.data);
    return [];
  }
}

/**
 * Create or update a user for a tenant
 * @param {string|number} tenantId - The tenant ID
 * @param {object} userData - User data to create/update
 * @returns {Promise} - Promise with created/updated user
 */
export const createOrUpdateTenantUser = async (tenantId, userData) => {
  try {
    console.log(`📡 Creating/updating user for tenant ${tenantId}:`, userData);
    
    // Set X-Tenant-ID header to match the route parameter
    api.defaults.headers.common['X-Tenant-ID'] = tenantId;
    
    // Make the request using the same tenant ID for both URL and header
    const response = await api.post(`/v1/tenants/${tenantId}/user`, userData);
    
    console.log('📥 User creation response:', response.data);
    
    // Return the user object from the response
    return response.data.user || response.data;
  } catch (error) {
    console.error('❌ Error creating/updating tenant user:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
}

export default {
  getTenantsForSelection,
  getTemples,
  getTempleById,
  createTemple,
  updateTemple,
  deleteTemple,
  getTenantUsers,
  createOrUpdateTenantUser
}