// src/services/donation.service.js
import api from '@/plugins/axios'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const { logout } = useAuth()
const { showToast } = useToast()

// ✅ Standalone helpers - no 'this' dependency
function getUserInfo() {
  try {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        userId: payload.user_id,
        role: payload.role || payload.role_name,
        entityId: payload.entity_id,
        assignedTenantId: payload.assigned_tenant_id
      }
    }
  } catch (error) {
    console.warn('Error parsing user info from token:', error)
  }
  return null
}

function getCurrentEntityId() {
  const currentPath = window.location.pathname
  const entityMatch = currentPath.match(/\/entity\/(\d+)/)
  if (entityMatch) return entityMatch[1]

  const storedEntityId = localStorage.getItem('current_entity_id')
  if (storedEntityId && storedEntityId !== 'null' && storedEntityId !== 'undefined') {
    return storedEntityId
  }

  const userInfo = getUserInfo()
  if (userInfo) {
    switch (userInfo.role) {
      case 'templeadmin':
        if (userInfo.entityId) return userInfo.entityId.toString()
        break
      case 'standarduser':
      case 'monitoringuser':
        if (userInfo.assignedTenantId) return userInfo.assignedTenantId.toString()
        break
    }
  }

  console.warn('Could not resolve entity ID')
  return null
}

export const donationService = {

  async createDonation(donationData) {
    try {
      console.log('Creating donation with data:', donationData)
      
      const entityId = getCurrentEntityId()
      
      if (!entityId) {
        throw new Error('No entity ID available for donation creation')
      }
      
      console.log(`Creating donation for entity ID: ${entityId}`)
      
      const payload = {
        Amount: Number(donationData.amount),
        DonationType: donationData.donationType || donationData.type || donationData.donation_type,
        Note: donationData.note || donationData.purpose || '',
        entity_id: parseInt(entityId),
      }

      if (donationData.referenceID) {
        payload.ReferenceID = donationData.referenceID
      }

      console.log('Sending donation payload:', payload)

      const response = await api.post('/donations', payload)

      console.log('Create donation response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creating donation:', error)
      if (error.response?.status === 401) {
        showToast('Please login to make a donation', 'error')
        logout()
      } else if (error.response?.status === 400) {
        const errorMsg = error.response.data?.error || 'Invalid donation data'
        showToast(errorMsg, 'error')
      } else {
        showToast('Failed to create donation', 'error')
      }
      throw error
    }
  },

  async getDonationHistory(filters = {}) {
    try {
      const entityId = getCurrentEntityId()
      const params = new URLSearchParams()

      if (entityId) params.append('entity_id', entityId)
      if (filters.page) params.append('page', filters.page)
      if (filters.limit) params.append('limit', filters.limit)
      if (filters.status) params.append('status', filters.status)
      if (filters.type) params.append('type', filters.type)
      if (filters.method) params.append('method', filters.method)
      if (filters.search) params.append('search', filters.search)
      if (filters.dateRange) params.append('dateRange', filters.dateRange)
      if (filters.from) params.append('from', filters.from)
      if (filters.to) params.append('to', filters.to)
      if (filters.minAmount) params.append('min', filters.minAmount)
      if (filters.maxAmount) params.append('max', filters.maxAmount)

      const response = await api.get(`/donations/history?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching donation history:', error)
      throw error
    }
  },

  async verifyDonation(paymentData) {
    try {
      console.log('Verifying donation with payment data:', paymentData)
      
      const payload = {
        paymentID: paymentData.razorpay_payment_id || paymentData.paymentID,
        orderID: paymentData.razorpay_order_id || paymentData.orderID,
        razorpaySig: paymentData.razorpay_signature || paymentData.razorpaySig,
        entity_id: parseInt(getCurrentEntityId()),
      }

      console.log('Sending verification payload:', payload)

      const response = await api.post('/donations/verify', payload)
      console.log('Verify donation response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error verifying donation:', error)
      if (error.response?.status === 400) {
        showToast('Payment verification failed', 'error')
      } else {
        showToast('Failed to verify donation', 'error')
      }
      throw error
    }
  },

  async getMyDonations() {
    try {
      console.log('Calling getMyDonations API...')
      
      const entityId = getCurrentEntityId()
      console.log(`Fetching my donations for entity ID: ${entityId}`)
      
      const url = entityId ? `/donations/my?entity_id=${entityId}` : '/donations/my'
      const response = await api.get(url)
      
      console.log('My donations response data:', response.data)

      if (response.data && response.data.success) {
        return response.data.data || []
      } else if (Array.isArray(response.data)) {
        return response.data
      } else if (response.data && response.data.data) {
        return response.data.data
      } else {
        return response.data || []
      }
    } catch (error) {
      console.error('Error fetching my donations:', error)
      if (error.response?.status === 401) {
        showToast('Please login to view your donations', 'error')
        logout()
      } else if (error.response?.status === 404) {
        return []
      } else {
        showToast('Failed to load your donations', 'error')
      }
      throw error
    }
  },

  async getMyRecentDonations(entityId = null) {
    try {
      console.log('Calling getMyRecentDonations API...')
      
      const targetEntityId = entityId || getCurrentEntityId()
      console.log(`🔍 Fetching my recent donations for entity ID: ${targetEntityId}`)
      
      const url = targetEntityId 
        ? `/donations/recent?entity_id=${targetEntityId}` 
        : '/donations/recent'
      
      console.log(`📡 Calling: ${url}`)
      const response = await api.get(url)
      
      console.log('✅ Recent donations response data:', response.data)

      if (response.data && response.data.recent_donations && Array.isArray(response.data.recent_donations)) {
        const recentDonations = response.data.recent_donations.map(donation => ({
          id: donation.id || donation.ID || Math.random(),
          user_id: donation.user_id || donation.UserID,
          entity_id: donation.entity_id || donation.EntityID,
          amount: donation.amount || donation.Amount,
          donation_type: donation.donation_type || donation.DonationType,
          donationType: donation.donation_type || donation.DonationType,
          type: donation.donation_type || donation.DonationType,
          method: donation.method || donation.Method,
          status: donation.status || donation.Status,
          date: donation.donated_at || donation.DonatedAt || donation.date || donation.created_at,
          donation_date: donation.donated_at || donation.DonatedAt,
          donated_at: donation.donated_at || donation.DonatedAt,
          created_at: donation.created_at || donation.CreatedAt,
          note: donation.note || donation.Note || donation.purpose
        }))
        console.log(`✅ Mapped ${recentDonations.length} recent donations`)
        return recentDonations
      } else if (Array.isArray(response.data)) {
        const mapped = response.data.map(donation => ({
          id: donation.id || donation.ID || Math.random(),
          user_id: donation.user_id || donation.UserID,
          entity_id: donation.entity_id || donation.EntityID,
          amount: donation.amount || donation.Amount,
          donation_type: donation.donation_type || donation.DonationType,
          donationType: donation.donation_type || donation.DonationType,
          type: donation.donation_type || donation.DonationType,
          method: donation.method || donation.Method,
          status: donation.status || donation.Status,
          date: donation.donated_at || donation.DonatedAt || donation.date || donation.created_at,
          donation_date: donation.donated_at || donation.DonatedAt,
          donated_at: donation.donated_at || donation.DonatedAt,
          created_at: donation.created_at || donation.CreatedAt,
          note: donation.note || donation.Note || donation.purpose
        }))
        return mapped
      } else {
        console.warn('⚠️ Unexpected response format for recent donations:', response.data)
        return []
      }
    } catch (error) {
      console.error('❌ Error fetching recent donations:', error)
      if (error.response?.status === 401) {
        showToast('Please login to view your recent donations', 'error')
        logout()
      } else if (error.response?.status === 404) {
        return []
      }
      return []
    }
  },

  async getRecentDonations(entityId = null, limit = 5) {
    try {
      const targetEntityId = entityId || getCurrentEntityId()
      console.log(`🔍 Fetching recent donations for entity ${targetEntityId}, limit: ${limit}`)
      
      try {
        const url = targetEntityId 
          ? `/donations/recent?entity_id=${targetEntityId}&limit=${limit}` 
          : `/donations/recent?limit=${limit}`
        
        console.log(`📡 Calling: ${url}`)
        const recentResponse = await api.get(url)
        
        if (recentResponse.data && recentResponse.data.recent_donations) {
          return recentResponse.data.recent_donations.slice(0, limit)
        }
      } catch (recentError) {
        console.warn('⚠️ Recent donations endpoint failed, falling back:', recentError)
      }

      const fallbackUrl = targetEntityId 
        ? `/donations?entity_id=${targetEntityId}&limit=${limit}&page=1` 
        : `/donations?limit=${limit}&page=1`
      
      const response = await api.get(fallbackUrl)
      return response.data?.data || []
    } catch (error) {
      console.error('❌ Error fetching recent donations:', error)
      if (error.response?.status === 403) {
        showToast('You do not have permission to view recent donations', 'error')
      }
      return []
    }
  },

  async getDonationStats() {
    try {
      const entityId = getCurrentEntityId()
      console.log(`Fetching donation stats for entity ID: ${entityId}`)
      
      const url = entityId ? `/donations/dashboard?entity_id=${entityId}` : '/donations/dashboard'
      const response = await api.get(url)
      
      console.log('Dashboard stats response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching donation stats:', error)
      if (error.response?.status === 403) {
        showToast('You do not have permission to view statistics', 'error')
      } else if (error.response?.status === 401) {
        showToast('Please login to view statistics', 'error')
        logout()
      } else {
        showToast('Failed to load statistics', 'error')
      }
      throw error
    }
  },

  async getDonations(filters = {}) {
    try {
      const entityId = getCurrentEntityId()
      console.log(`Fetching donations for entity ID: ${entityId}`)
      
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(entityId ? { entity_id: entityId } : {}),
        ...(filters.status && filters.status !== 'all' ? { status: filters.status } : {}),
        ...(filters.type && filters.type !== 'all' ? { type: filters.type } : {}),
        ...(filters.method && filters.method !== 'all' ? { method: filters.method } : {}),
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.min !== undefined && filters.min !== null && filters.min !== '' ? { min: filters.min } : {}),
        ...(filters.max !== undefined && filters.max !== null && filters.max !== '' ? { max: filters.max } : {}),
        ...(filters.from ? { from: filters.from } : {}),
        ...(filters.to ? { to: filters.to } : {}),
        ...(filters.dateRange && filters.dateRange !== 'all' ? { dateRange: filters.dateRange } : {}),
      }

      const response = await api.get('/donations/', { params })
      console.log('Get donations response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching donations:', error)
      if (error.response?.status === 403) {
        showToast('You do not have permission to view donations', 'error')
        logout()
      } else if (error.response?.status === 404) {
        showToast('Donation endpoint not found', 'error')
      } else if (error.response?.status === 401) {
        showToast('Please login to view donations', 'error')
        logout()
      } else {
        showToast('Failed to load donations', 'error')
      }
      throw error
    }
  },

  async getDashboard(passedEntityId = null) {
    try {
      const entityId = passedEntityId || getCurrentEntityId()
      const url = entityId ? `/donations/dashboard?entity_id=${entityId}` : '/donations/dashboard'
      const response = await api.get(url)
      console.log('Dashboard data response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching donation dashboard:', error)
      if (error.response?.status === 401) {
        showToast('Please login to view dashboard', 'error')
        logout()
      } else if (error.response?.status === 403) {
        showToast('You do not have permission to view dashboard', 'error')
      } else {
        showToast('Failed to load dashboard data', 'error')
      }
      throw error
    }
  },

  async getTopDonors(limit = 5, passedEntityId = null) {
    try {
      const entityId = passedEntityId || getCurrentEntityId()
      const params = { limit, ...(entityId ? { entity_id: entityId } : {}) }
      const response = await api.get('/donations/top-donors', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching top donors:', error)
      if (error.response?.status === 403) {
        showToast('You do not have permission to view top donors', 'error')
      } else {
        showToast('Failed to load top donors', 'error')
      }
      throw error
    }
  },

  async getAnalytics(days = 30, passedEntityId = null) {
    try {
      const entityId = passedEntityId || getCurrentEntityId()
      const params = { days, ...(entityId ? { entity_id: entityId } : {}) }
      const response = await api.get('/donations/analytics', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching analytics:', error)
      if (error.response?.status === 403) {
        showToast('You do not have permission to view analytics', 'error')
      } else {
        showToast('Failed to load analytics', 'error')
      }
      throw error
    }
  },

  async getEntitySummary(entityId) {
    try {
      const response = await api.get(`/donations/summary/${entityId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching entity summary:', error)
      throw error
    }
  },

  async exportDonations(filters = {}, format = 'csv') {
    try {
      const entityId = getCurrentEntityId()
      
      const params = {
        format,
        ...(entityId ? { entity_id: entityId } : {}),
        ...(filters.status && filters.status !== 'all' ? { status: filters.status } : {}),
        ...(filters.type && filters.type !== 'all' ? { type: filters.type } : {}),
        ...(filters.method && filters.method !== 'all' ? { method: filters.method } : {}),
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.from ? { from: filters.from } : {}),
        ...(filters.to ? { to: filters.to } : {}),
      }

      const response = await api.get('/donations/export', { params, responseType: 'blob' })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `donations_export_${new Date().toISOString().slice(0, 10)}.${format}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return response.data
    } catch (error) {
      console.error('Error exporting donations:', error)
      if (error.response?.status === 403) {
        showToast('You do not have permission to export donations', 'error')
      } else {
        showToast('Failed to export donations', 'error')
      }
      throw error
    }
  },

  // Helper: get current entity ID
  getDonationTypes() {
    return [
      { value: 'general', label: 'General Donation' },
      { value: 'seva', label: 'Seva Donation' },
      { value: 'festival', label: 'Festival Donation' },
      { value: 'construction', label: 'Construction Fund' },
      { value: 'annadanam', label: 'Annadanam' },
      { value: 'education', label: 'Education Fund' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'temple_maintenance', label: 'Temple Maintenance' },
      { value: 'event', label: 'Event Donation' },
    ]
  },
}

// ✅ Export standalone helper for use in stores
export { getCurrentEntityId }

export default donationService