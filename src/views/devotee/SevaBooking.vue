<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Screen for Initial Load -->
    <div v-if="initialLoading" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Loading temple information...</p>
      </div>
    </div>

    <!-- Main Content (shows after initial load) -->
    <template v-else>
      <!-- Temple Header Bar -->
      <div class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  {{ currentTemple.name || 'Temple' }}
                </h2>
                <p class="text-sm text-gray-500" v-if="currentTemple.city || currentTemple.state">
                  {{ currentTemple.city }}{{ currentTemple.city && currentTemple.state ? ', ' : '' }}{{ currentTemple.state }}
                </p>
              </div>
            </div>
            
            <!-- User Info -->
            <div class="flex items-center space-x-3">
              <div class="text-right hidden sm:block">
                <p class="text-gray-900 font-medium text-sm">{{ currentUser.name || 'Devotee' }}</p>
                <p class="text-gray-500 text-xs">{{ currentUser.email || '' }}</p>
              </div>
              <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Book Seva</h1>
                <p class="mt-2 text-sm text-gray-600">Choose from available sevas and book your preferred time slots</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Filters and Search -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search Sevas</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by seva name..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Seva Type</label>
              <select
                v-model="selectedCategory"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">Select Seva Type</option>
                <option value="daily">Daily Seva</option>
                <option value="special">Special Seva</option>
                <option value="festival">Festival Seva</option>
                <option value="personal">Personal Seva</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                v-model="priceRange"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">All Prices</option>
                <option value="0-500">₹0 - ₹500</option>
                <option value="500-1000">₹500 - ₹1,000</option>
                <option value="1000-5000">₹1,000 - ₹5,000</option>
                <option value="5000+">₹5,000+</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading sevas...</p>
          </div>
        </div>

        <!-- No Sevas Available -->
        <div v-else-if="filteredSevas.length === 0" class="text-center py-12">
          <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Sevas Available</h3>
          <p class="text-gray-500 mb-4">No sevas match your current filters or none have been added by the temple yet.</p>
          <button
            @click="clearFilters"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <!-- Seva Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="seva in filteredSevas"
            :key="seva.id"
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <!-- Seva Image -->
            <div class="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
              <img
                v-if="seva.image"
                :src="seva.image"
                :alt="seva.name"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-20"></div>
              <div class="absolute top-4 right-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    seva.seva_type === 'daily' ? 'bg-green-100 text-green-800' :
                    seva.seva_type === 'special' ? 'bg-blue-100 text-blue-800' :
                    seva.seva_type === 'festival' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ seva.seva_type }}
                </span>
              </div>
            </div>

            <!-- Seva Content -->
            <div class="p-6">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-semibold text-gray-900">{{ seva.name }}</h3>
                <div class="text-right">
                  <p class="text-xl font-bold text-indigo-600">₹{{ seva.price.toLocaleString() }}</p>
                  <p v-if="seva.originalPrice && seva.originalPrice > seva.price" class="text-sm text-gray-500 line-through">
                    ₹{{ seva.originalPrice.toLocaleString() }}
                  </p>
                </div>
              </div>

              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ seva.description }}</p>

              <!-- Seva Details -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Duration: {{ seva.duration }} minutes
                </div>
                <div class="flex items-center text-sm">
                  <svg class="w-4 h-4 mr-2" :class="getAvailableSlots(seva) > 0 ? 'text-green-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <span :class="getAvailableSlots(seva) > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                    Available: {{ getAvailableSlots(seva) }} / {{ seva.max_bookings_per_day || 0 }} slots
                  </span>
                </div>
                <div v-if="seva.date" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Date: {{ formatDate(seva.date) }}
                </div>
                <div v-if="seva.start_time && seva.end_time" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Time: {{ seva.start_time }} - {{ seva.end_time }}
                </div>
              </div>

              <!-- Status Badge for Pending Approval -->
              <div v-if="pendingApprovalSevas[seva.id]" class="mb-3">
                <div class="flex items-center justify-center px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <svg class="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm font-medium text-yellow-800">Pending Approval</span>
                </div>
              </div>

              <!-- Action Button -->
              <button
                @click="directBookSeva(seva)"
                :disabled="bookedSevas[seva.id] || bookingInProgress[seva.id] || getAvailableSlots(seva) === 0 || pendingApprovalSevas[seva.id]"
                :class="[
                  'w-full py-3 px-4 rounded-lg font-medium transition-colors',
                  bookingInProgress[seva.id] ? 'bg-gray-400 text-white cursor-wait' :
                  bookedSevas[seva.id] ? 'bg-green-600 text-white cursor-default' :
                  pendingApprovalSevas[seva.id] ? 'bg-yellow-400 text-yellow-900 cursor-default' :
                  getAvailableSlots(seva) > 0
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <span v-if="bookingInProgress[seva.id]">Booking...</span>
                <span v-else-if="bookedSevas[seva.id]">✓ Seva Booked</span>
                <span v-else-if="pendingApprovalSevas[seva.id]">⏳ Pending Approval</span>
                <span v-else-if="getAvailableSlots(seva) > 0">Book Now</span>
                <span v-else>Fully Booked</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSevaStore } from '@/stores/seva'
import { useToast } from '@/composables/useToast'
import sevaService from '@/services/seva.service'
import api from '@/plugins/axios'

const route = useRoute()
const router = useRouter()
const sevaStore = useSevaStore()
const toast = useToast()

// Reactive data
const initialLoading = ref(true)
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedDate = ref('')
const priceRange = ref('')
const bookingCounts = ref({}) // Track approved bookings count per seva
const bookedSevas = reactive({}) // Track if user has approved booking for this seva
const bookingInProgress = reactive({}) // Track booking in progress
const pendingApprovalSevas = reactive({}) // Track sevas with pending approval

// Temple and User info
const currentTemple = ref({
  name: '',
  city: '',
  state: ''
})

const currentUser = ref({
  name: '',
  email: ''
})

// Get current entity ID from route
const currentEntityId = computed(() => route.params.id)

// Calculate available slots for a seva (based on approved bookings only)
const getAvailableSlots = (seva) => {
  const maxSlots = seva.max_bookings_per_day || 0
  const approvedBookings = bookingCounts.value[seva.id] || 0
  const available = Math.max(0, maxSlots - approvedBookings)
  return available
}

// Fetch temple information
const fetchTempleInfo = async () => {
  try {
    console.log('Fetching temple information...')
    
    // Try localStorage first for immediate display
    const storedTempleName = localStorage.getItem('selectedTempleName')
    if (storedTempleName) {
      currentTemple.value.name = storedTempleName
      console.log('Temple name from localStorage:', storedTempleName)
    }
    
    // Get entity ID
    const entityId = currentEntityId.value ||
                     localStorage.getItem('selectedEntityId') || 
                     localStorage.getItem('current_entity_id') ||
                     localStorage.getItem('current_tenant_id')
    
    if (!entityId) {
      console.warn('No entity ID found')
      currentTemple.value.name = 'Temple'
      return
    }
    
    console.log('Fetching temple details for entity ID:', entityId)
    
    // Fetch from API (don't block on this)
    try {
      const response = await api.get(`/entities/${entityId}`)
      console.log('Temple API response:', response)
      
      const templeData = response.data?.data || response.data || response
      
      if (templeData) {
        currentTemple.value = {
          name: templeData.name || templeData.Name || storedTempleName || 'Temple',
          city: templeData.city || templeData.City || '',
          state: templeData.state || templeData.State || ''
        }
        
        // Save to localStorage
        if (currentTemple.value.name) {
          localStorage.setItem('selectedTempleName', currentTemple.value.name)
        }
        
        console.log('Temple info loaded:', currentTemple.value)
      }
    } catch (apiError) {
      console.warn('API fetch failed, using localStorage data:', apiError)
      currentTemple.value.name = storedTempleName || 'Temple'
    }
  } catch (error) {
    console.error('Error fetching temple info:', error)
    currentTemple.value.name = localStorage.getItem('selectedTempleName') || 'Temple'
  }
}

// Fetch user information
const fetchUserInfo = () => {
  try {
    // Try to get user info from localStorage
    const userName = localStorage.getItem('user_name') || localStorage.getItem('userName')
    const userEmail = localStorage.getItem('user_email') || localStorage.getItem('userEmail')
    
    // Try to parse user_data if available
    try {
      const userData = localStorage.getItem('user_data')
      if (userData) {
        const parsed = JSON.parse(userData)
        currentUser.value = {
          name: parsed.name || parsed.Name || userName || 'Devotee',
          email: parsed.email || parsed.Email || userEmail || ''
        }
        return
      }
    } catch (parseError) {
      console.warn('Error parsing user_data:', parseError)
    }
    
    // Fallback to individual localStorage items
    currentUser.value = {
      name: userName || 'Devotee',
      email: userEmail || ''
    }
    
    console.log('User info loaded:', currentUser.value)
  } catch (error) {
    console.error('Error fetching user info:', error)
    currentUser.value = {
      name: 'Devotee',
      email: ''
    }
  }
}

// Computed properties
const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

const filteredSevas = computed(() => {
  let filtered = sevaStore.sevas
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(seva =>
      seva.name?.toLowerCase().includes(query) ||
      seva.description?.toLowerCase().includes(query)
    )
  }
  
  if (selectedCategory.value) {
    filtered = filtered.filter(seva => seva.seva_type === selectedCategory.value)
  }
  
  if (priceRange.value) {
    filtered = filtered.filter(seva => {
      const price = seva.price
      switch (priceRange.value) {
        case '0-500': return price <= 500
        case '500-1000': return price > 500 && price <= 1000
        case '1000-5000': return price > 1000 && price <= 5000
        case '5000+': return price > 5000
        default: return true
      }
    })
  }
  
  return filtered
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedDate.value = ''
  priceRange.value = ''
}

// UPDATED: Fetch only approved booking counts from API
const fetchBookingCounts = async () => {
  try {
    console.log('Fetching approved booking counts...')
    
    // Get entity ID
    const entityId = currentEntityId.value ||
                     localStorage.getItem('selectedEntityId') || 
                     localStorage.getItem('current_entity_id') ||
                     localStorage.getItem('current_tenant_id')
    
    if (!entityId) {
      console.warn('No entity ID available for fetching booking counts')
      sevaStore.sevas.forEach(seva => {
        bookingCounts.value[seva.id] = 0
      })
      return
    }
    
    // NEW: Call the new approved counts endpoint
    const response = await api.get('/seva/approved-counts', {
      params: { entity_id: entityId }
    })
    
    console.log('Approved counts API response:', response.data)
    
    if (response.data && response.data.data) {
      // Clear existing counts
      bookingCounts.value = {}
      
      // Update with approved bookings count only
      response.data.data.forEach(item => {
        const sevaId = item.seva_id || item.SevaID
        const approvedCount = item.approved_count || 0
        
        if (sevaId) {
          bookingCounts.value[sevaId] = approvedCount
        }
      })
      
      console.log('Approved booking counts loaded:', bookingCounts.value)
    } else {
      // Initialize with zeros as fallback
      sevaStore.sevas.forEach(seva => {
        bookingCounts.value[seva.id] = 0
      })
    }
  } catch (error) {
    console.error('Failed to fetch booking counts:', error)
    
    // Initialize with zeros as fallback
    sevaStore.sevas.forEach(seva => {
      bookingCounts.value[seva.id] = 0
    })
  }
}

// Direct booking function
const directBookSeva = async (seva) => {
  // Don't do anything if already booked, in progress, fully booked, or pending approval
  if (bookedSevas[seva.id] || 
      bookingInProgress[seva.id] || 
      getAvailableSlots(seva) <= 0 ||
      pendingApprovalSevas[seva.id]) {
    return
  }
  
  // Set booking in progress for this seva
  bookingInProgress[seva.id] = true
  
  try {
    console.log('Sending booking request for seva:', seva.id)
    
    // Pass only the seva ID to the service
    const response = await sevaService.bookSeva(seva.id)
    console.log('Booking response:', response)
    
    if (response.success) {
      const sevaId = seva.id.toString()
      
      // Mark this seva as pending approval for this user
      pendingApprovalSevas[sevaId] = true
      
      // Don't decrease available slots yet - only after temple admin approves
      // Slots will be decreased when admin approves the booking
      
      toast.success('Booking request sent! Waiting for temple approval.')
      
      console.log('Booking created, marked as pending approval:', sevaId)
    } else {
      toast.error(response.error || 'Failed to book seva')
    }
  } catch (error) {
    console.error('Booking failed:', error)
    console.error('Error details:', error.response?.data || 'No response data')
    
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Booking failed. Please try again.'
    toast.error(errorMessage)
  } finally {
    // Clear booking in progress state
    bookingInProgress[seva.id] = false
  }
}

const fetchSevas = async () => {
  loading.value = true
  try {
    // Apply current filters when fetching
    const params = {
      search: searchQuery.value,
      seva_type: selectedCategory.value
    }
    
    await sevaStore.fetchSevas(params)
    
    // Fetch approved booking counts (this determines available slots)
    await fetchBookingCounts()
    
    // Check user's bookings (approved and pending)
    await fetchUserBookings()
    
  } catch (error) {
    console.error('Failed to load sevas:', error)
    
    // Display more specific error message
    if (error.toString && error.toString().includes('Availability: unsupported relations')) {
      toast.error('Database schema issue. Please contact the administrator.')
    } else {
      toast.error('Failed to load sevas. Please try again.')
    }
  } finally {
    loading.value = false
  }
}

// UPDATED: Fetch user's bookings and update the UI
const fetchUserBookings = async () => {
  try {
    const response = await sevaService.getMyBookings()
    
    if (response.success && response.data) {
      console.log('User bookings response:', response.data)
      
      // Clear existing states
      Object.keys(bookedSevas).forEach(key => {
        delete bookedSevas[key]
      })
      Object.keys(pendingApprovalSevas).forEach(key => {
        delete pendingApprovalSevas[key]
      })
      
      // Process user's bookings
      response.data.forEach(booking => {
        const sevaId = (booking.seva_id || booking.SevaID)?.toString()
        const status = (booking.status || booking.Status || '').toLowerCase()
        
        if (sevaId) {
          console.log(`Processing booking - SevaID: ${sevaId}, Status: ${status}`)
          
          // If booking is approved, mark as booked
          if (status === 'approved') {
            bookedSevas[sevaId] = true
            console.log('Marked as booked (approved):', sevaId)
          }
          // If booking is pending, mark as pending approval
          else if (status === 'pending') {
            pendingApprovalSevas[sevaId] = true
            console.log('Marked as pending approval:', sevaId)
          }
        }
      })
      
      console.log('Final state - Booked:', bookedSevas, 'Pending:', pendingApprovalSevas)
    }
  } catch (error) {
    console.error('Failed to fetch user bookings:', error)
  }
}

// Lifecycle
onMounted(async () => {
  console.log('SevaBooking component mounted')
  
  try {
    // Load user info first (synchronous, from localStorage)
    fetchUserInfo()
    
    // Load temple info (quick, uses localStorage first)
    await fetchTempleInfo()
    
    // Show the page immediately after temple info loads
    initialLoading.value = false
    
    // Then load sevas in background
    loading.value = true
    
    // First fetch sevas
    await fetchSevas()
    
    console.log('Component initialized successfully')
    console.log('Available slots per seva:', 
      Object.fromEntries(
        sevaStore.sevas.map(s => [s.id, getAvailableSlots(s)])
      )
    )
  } catch (error) {
    console.error('Error during component initialization:', error)
    toast.error('Failed to load page data')
  } finally {
    initialLoading.value = false
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>