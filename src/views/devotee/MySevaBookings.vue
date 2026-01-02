<template>
  
  <div>
    <!-- Temple Header Bar -->
    <div class="bg-white shadow-lg mb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">
                {{ currentTemple.name || 'Loading Temple...' }}
              </h1>
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
    <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">My Seva Bookings</h2>
          <p class="text-gray-600 mt-1">View and manage all your seva bookings</p>
        </div>
        <router-link 
          :to="`/entity/${route.params.id}/devotee/seva-booking`"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Book New Seva
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            v-model="filters.dateRange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search seva name..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading || sevaStore.loadingRecentSevas || sevaStore.loadingCatalog" class="bg-white p-6 rounded-xl shadow-sm flex justify-center">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600">Loading your seva bookings...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white p-6 rounded-xl shadow-sm flex justify-center">
      <div class="flex flex-col items-center text-center">
        <svg class="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Error loading seva bookings</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <button 
          @click="fetchSevaBookings"
          class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Seva Bookings List -->
    <div v-else-if="filteredBookings.length > 0" class="bg-white p-6 rounded-xl shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seva
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seva Booked Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Seva Scheduled date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="booking in filteredBookings" :key="booking.id || booking.ID" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg class="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ booking.seva_name || (booking.seva && booking.seva.name) || `Seva ${booking.seva_id || booking.SevaID || ''}` }}</div>
                    <div class="text-xs text-gray-500">{{ booking.seva_type || (booking.seva && booking.seva.type) || '' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(booking.booking_time || booking.BookingTime) }}</div>
                <div class="text-xs text-gray-500">{{ formatTime(booking.booking_time || booking.BookingTime) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getSevaScheduleDate(booking) }}</div>
                <div class="text-xs text-gray-500">{{ getSevaScheduleTime(booking) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="getStatusClass(booking.status || booking.Status)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ formatStatus(booking.status || booking.Status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  type="button"
                  @click="viewBookingDetails(booking)"
                  class="text-indigo-600 hover:text-indigo-900 font-medium focus:outline-none hover:underline transition-colors duration-150"
                  title="View Details"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white p-8 rounded-xl shadow-sm text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"/>
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No seva bookings found</h3>
      <p class="mt-1 text-sm text-gray-500">You haven't booked any sevas yet for this temple.</p>
      <div class="mt-6">
        <router-link 
          :to="`/entity/${route.params.id}/devotee/seva-booking`"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          Book Your First Seva
        </router-link>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div
      v-if="selectedBooking"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Seva Booking Details</h2>
          <button
            type="button"
            @click="selectedBooking = null"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <div class="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ selectedBooking.seva_name || (selectedBooking.seva && selectedBooking.seva.name) || `Seva ${selectedBooking.seva_id || selectedBooking.SevaID || ''}` }}
              </h3>
              <span 
                :class="getStatusClass(selectedBooking.status || selectedBooking.Status)" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                <span :class="getStatusDotClass(selectedBooking.status || selectedBooking.Status)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                {{ formatStatus(selectedBooking.status || selectedBooking.Status) }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Seva Type</p>
                <p class="mt-1 text-base text-gray-900">{{ selectedBooking.seva_type || (selectedBooking.seva && selectedBooking.seva.type) || 'Not specified' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Amount</p>
                <p class="mt-1 text-base font-semibold text-indigo-600">
                  ₹{{ getBookingAmount(selectedBooking) }}
                </p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Booking Date</p>
                <p class="mt-1 text-base text-gray-900">{{ formatDate(selectedBooking.booking_time || selectedBooking.BookingTime) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Booking Time</p>
                <p class="mt-1 text-base text-gray-900">{{ formatTime(selectedBooking.booking_time || selectedBooking.BookingTime) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Seva Schedule Date</p>
                <p class="mt-1 text-base text-gray-900">{{ getSevaScheduleDate(selectedBooking) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Seva Schedule Time</p>
                <p class="mt-1 text-base text-gray-900">{{ getSevaScheduleTime(selectedBooking) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Booking ID</p>
                <p class="mt-1 text-base text-gray-900">#{{ selectedBooking.id || selectedBooking.ID }}</p>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <p class="text-sm font-medium text-gray-500 mb-2">Description</p>
              <p class="text-base text-gray-700">
                {{ selectedBooking.seva_description || (selectedBooking.seva && selectedBooking.seva.description) || 'No description available' }}
              </p>
            </div>

            <div v-if="selectedBooking.special_requests || selectedBooking.SpecialRequests" class="border-t border-gray-200 pt-4 mt-4">
              <p class="text-sm font-medium text-gray-500 mb-2">Special Requests</p>
              <p class="text-base text-gray-700">{{ selectedBooking.special_requests || selectedBooking.SpecialRequests }}</p>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="flex justify-end border-t border-gray-200 pt-6">
            <button 
              type="button"
              @click="selectedBooking = null"
              class="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSevaStore } from '@/stores/seva'
import { useToast } from '@/composables/useToast'
import BaseModal from '@/components/common/BaseModal.vue'
import { sevaService } from '@/services/seva.service'
import api from '@/plugins/axios'

const route = useRoute()
const router = useRouter()
const sevaStore = useSevaStore()
const toast = useToast()

// State
const loading = ref(false)
const error = ref(null)
const filters = ref({
  status: 'all',
  dateRange: 'all',
  search: ''
})
const selectedBooking = ref(null)

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

// Fetch temple information
const fetchTempleInfo = async () => {
  try {
    console.log('Fetching temple information...')
    
    // Try localStorage first for quick load
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
      return
    }
    
    console.log('Fetching temple details for entity ID:', entityId)
    
    // Fetch from API
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

// Format helpers
const formatDate = (dateTime) => {
  if (!dateTime) return ''
  
  try {
    const date = new Date(dateTime)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

const formatTime = (dateTime) => {
  if (!dateTime) return ''
  
  try {
    const date = new Date(dateTime)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  } catch (error) {
    console.error('Error formatting time:', error)
    return ''
  }
}

const formatStatus = (status) => {
  if (!status) return 'Pending'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

// Get seva schedule date and time
const getSevaScheduleDate = (booking) => {
  if (booking.seva && booking.seva.date) {
    return formatDate(booking.seva.date)
  }
  
  if (booking.schedule_time || booking.ScheduleTime) {
    return formatDate(booking.schedule_time || booking.ScheduleTime)
  }
  
  if (booking.time_slot_date || booking.TimeSlotDate) {
    return formatDate(booking.time_slot_date || booking.TimeSlotDate)
  }
  
  return 'Not scheduled'
}

const getSevaScheduleTime = (booking) => {
  if (booking.seva) {
    if (booking.seva.start_time && booking.seva.end_time) {
      return `${booking.seva.start_time} - ${booking.seva.end_time}`
    }
    if (booking.seva.start_time) {
      return booking.seva.start_time
    }
    if (booking.seva.time) {
      return booking.seva.time
    }
  }
  
  if (booking.schedule_time || booking.ScheduleTime) {
    return formatTime(booking.schedule_time || booking.ScheduleTime)
  }
  
  if (booking.time_slot || booking.TimeSlot) {
    return booking.time_slot || booking.TimeSlot
  }
  
  if (booking.time_slot_time || booking.TimeSlotTime) {
    return formatTime(booking.time_slot_time || booking.TimeSlotTime)
  }
  
  return 'Not scheduled'
}

// Status styles
const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  
  const statusMap = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800'
  }
  
  return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getStatusDotClass = (status) => {
  if (!status) return 'bg-gray-400'
  
  const dotMap = {
    pending: 'bg-yellow-400',
    approved: 'bg-green-400',
    completed: 'bg-blue-400',
    cancelled: 'bg-red-400',
    rejected: 'bg-red-400'
  }
  
  return dotMap[status.toLowerCase()] || 'bg-gray-400'
}

// Helper to get booking amount - checks multiple possible fields
const getBookingAmount = (booking) => {
  if (!booking) return 0
  
  // Check various possible amount fields (uppercase and lowercase)
  const amount = booking.amount || 
                 booking.Amount || 
                 booking.price || 
                 booking.Price || 
                 booking.amount_paid || 
                 booking.AmountPaid ||
                 (booking.seva && booking.seva.price) ||
                 (booking.seva && booking.seva.Price) ||
                 0
  
  return parseFloat(amount).toLocaleString('en-IN')
}

// Computed - Filter bookings by current entity
const filteredBookings = computed(() => {
  let result = sevaStore.recentSevas || []
  
  console.log('All seva bookings before entity filtering:', result)
  console.log('Current entity ID:', currentEntityId.value)
  
  // First filter by current entity ID
  result = result.filter(booking => {
    const bookingEntityId = booking.entity_id || booking.EntityID || booking.seva?.entity_id
    const currentEntity = parseInt(currentEntityId.value)
    
    console.log(`Booking entity ID: ${bookingEntityId}, Current entity: ${currentEntity}`)
    
    return parseInt(bookingEntityId) === currentEntity
  })
  
  console.log('Bookings after entity filtering:', result)
  
  // Filter by status
  if (filters.value.status !== 'all') {
    result = result.filter(booking => {
      const bookingStatus = (booking.status || booking.Status || '').toLowerCase()
      return bookingStatus === filters.value.status.toLowerCase()
    })
  }
  
  // Filter by date range
  if (filters.value.dateRange !== 'all') {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    
    result = result.filter(booking => {
      const bookingDate = new Date(booking.booking_time || booking.BookingTime || new Date())
      
      switch (filters.value.dateRange) {
        case 'today':
          return bookingDate >= today
        case 'week':
          return bookingDate >= startOfWeek
        case 'month':
          return bookingDate >= startOfMonth
        case 'year':
          return bookingDate >= startOfYear
        default:
          return true
      }
    })
  }
  
  // Filter by search
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(booking => {
      const sevaName = (booking.seva_name || (booking.seva && booking.seva.name) || '').toLowerCase()
      const sevaType = (booking.seva_type || (booking.seva && booking.seva.type) || '').toLowerCase()
      const specialRequests = (booking.special_requests || booking.SpecialRequests || '').toLowerCase()
      
      return sevaName.includes(search) || 
             sevaType.includes(search) || 
             specialRequests.includes(search)
    })
  }
  
  return result
})

// Methods
const fetchSevaBookings = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('Fetching seva bookings for entity:', currentEntityId.value)
    
    // First fetch the seva catalog to get seva details
    await sevaStore.fetchSevas({ entity_id: currentEntityId.value })
    console.log('Seva catalog fetched:', sevaStore.sevas)
    
    // Pass entity ID to the store method
    await sevaStore.fetchRecentSevas(currentEntityId.value)
    console.log('Recent sevas before merge:', sevaStore.recentSevas)
    
    // Merge seva details with bookings
    if (sevaStore.recentSevas && sevaStore.recentSevas.length > 0) {
      sevaStore.recentSevas = sevaStore.recentSevas.map(booking => {
        const sevaId = booking.seva_id || booking.SevaID
        console.log('Looking for seva with ID:', sevaId)
        
        const sevaDetails = sevaStore.sevas.find(s => {
          console.log('Comparing with seva:', s.id, s.ID)
          return parseInt(s.id) === parseInt(sevaId) || parseInt(s.ID) === parseInt(sevaId)
        })
        
        console.log('Found seva details:', sevaDetails)
        
        if (sevaDetails) {
          return {
            ...booking,
            seva: sevaDetails,
            seva_name: booking.seva_name || sevaDetails.name,
            seva_type: booking.seva_type || sevaDetails.seva_type,
            seva_description: booking.seva_description || sevaDetails.description
          }
        }
        return booking
      })
    }
    
    console.log("Fetched seva bookings with seva details merged:", sevaStore.recentSevas)
  } catch (err) {
    console.error('Error fetching seva bookings:', err)
    error.value = err.message || 'Failed to load seva bookings'
  } finally {
    loading.value = false
  }
}

const viewBookingDetails = (booking) => {
  console.log('=== VIEW BOOKING DETAILS CLICKED ===')
  console.log('Booking data:', booking)
  selectedBooking.value = booking
  console.log('selectedBooking.value set to:', selectedBooking.value)
}

// Watch for route changes to refetch data
watch(() => route.params.id, (newEntityId, oldEntityId) => {
  if (newEntityId && newEntityId !== oldEntityId) {
    console.log('Entity changed from', oldEntityId, 'to', newEntityId)
    fetchTempleInfo()
    fetchSevaBookings()
  }
})

// Lifecycle hooks
onMounted(async () => {
  console.log('SevaBookings component mounted')
  
  // Load user info first (synchronous, from localStorage)
  fetchUserInfo()
  
  // Then load temple and seva bookings data
  await fetchTempleInfo()
  await fetchSevaBookings()
  
  // Log store state for debugging
  console.log("Final sevaStore state:", {
    recentSevas: sevaStore.recentSevas,
    sevaCatalog: sevaStore.sevaCatalog,
    loadingRecentSevas: sevaStore.loadingRecentSevas,
    loadingCatalog: sevaStore.loadingCatalog,
    currentEntityId: currentEntityId.value,
    currentTemple: currentTemple.value,
    currentUser: currentUser.value
  })
})
</script>