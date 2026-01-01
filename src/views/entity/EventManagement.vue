<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with Temple Info -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
           <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">{{ temple ? temple.name : 'Loading...' }}</h1>
              <p class="text-sm text-gray-500">{{ temple ? `${temple.city}, ${temple.state}` : 'Loading location...' }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Header Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Events & Festivals</h2>
            <p class="mt-1 text-sm text-gray-600">
              Create and manage temple events, festivals, and special occasions
            </p>
          </div>
          <button
            @click="handleCreateEventClick"
            :disabled="isMonitoringUser"
            :class="[
              'inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-colors duration-200',
              isMonitoringUser
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            ]"
            :title="isMonitoringUser ? 'Monitoring users are not allowed to create events' : 'Create a new event'"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Create Event
          </button>
        </div>
      </div>
    </div>

    <!-- Permission Denied Alert for Monitoring Users -->
    <div v-if="showPermissionAlert" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-lg font-semibold text-red-800">Access Restricted</h3>
            <p class="mt-2 text-sm text-red-700">
              You are not allowed to create or modify events. Monitoring users have view-only access. 
              Please contact your administrator if you need additional permissions.
            </p>
          </div>
          <button 
            @click="showPermissionAlert = false"
            class="flex-shrink-0 ml-4 text-red-500 hover:text-red-700"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Events</p>
              <p class="text-2xl font-bold text-gray-900">{{ eventStats.total || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ eventStats.thisMonth || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Upcoming</p>
              <p class="text-2xl font-bold text-gray-900">{{ eventStats.upcoming || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-gray-900">{{ eventStats.completed || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- View Toggle and Filters -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <!-- View Toggle -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            @click="currentView = 'list'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
              currentView === 'list'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            List View
          </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-3">
          <select
            v-model="filters.status"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            @change="applyFilters"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <select
            v-model="filters.category"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            @change="applyFilters"
          >
            <option value="all">All Categories</option>
            <option value="festival">Festival</option>
            <option value="ceremony">Ceremony</option>
            <option value="spiritual">Spiritual Discourse</option>
            <option value="cultural">Cultural Program</option>
            <option value="community">Community Gathering</option>
          </select>

          <div class="relative">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search events..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              @input="debounceSearch"
            >
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <svg class="animate-spin h-10 w-10 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-gray-600">Loading events...</p>
      </div>

      <!-- No Events Message -->
      <div v-else-if="!loading && filteredEvents.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No events found</h3>
        <p class="mt-1 text-gray-500">
          {{ searchTerm || filters.status !== 'all' || filters.category !== 'all' ? 
             'Try adjusting your filters or search terms' : 'Create your first event to get started' }}
        </p>
        <button
          v-if="!isMonitoringUser"
          @click="handleCreateEventClick"
          class="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Create Event
        </button>
      </div>

      <!-- Content Area -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100">
        <!-- List View -->
        <div v-if="currentView === 'list'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="event in filteredEvents" :key="event.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                      <img v-if="event.imageURL" :src="event.imageURL" class="h-full w-full object-cover" alt="Event" />
                      <div v-else class="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-700">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ event.title }}</div>
                      <div class="text-sm text-gray-500">{{ truncateText(event.description, 40) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(event.eventDate) }}</div>
                  <div class="text-sm text-gray-500">{{ formatEventTime(event) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getTypeClass(event.type)">
                    {{ formatEventType(event.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(event)">
                    {{ getEventStatus(event) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3">
                    <button 
                      v-if="!isMonitoringUser"
                      @click="handleEditEvent(event)" 
                      class="text-indigo-600 hover:text-indigo-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      v-else
                      @click="showPermissionAlert = true"
                      class="text-gray-400 cursor-not-allowed"
                      title="Monitoring users cannot edit events"
                    >
                      Edit
                    </button>
                    <button 
                      v-if="!isMonitoringUser"
                      @click="confirmDeleteEvent(event)" 
                      class="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      v-else
                      @click="showPermissionAlert = true"
                      class="text-gray-400 cursor-not-allowed"
                      title="Monitoring users cannot delete events"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Event Modal -->
    <div
      v-if="showCreateEventModal || showEditEventModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModals"
    >
      <div
        class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <EventForm
          :event="selectedEvent"
          :is-edit="showEditEventModal"
          @submit="handleSaveEvent"
          @cancel="closeModals"
        />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="showDeleteModal = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl max-w-lg w-full"
        @click.stop
      >
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
          <p class="text-gray-600 mb-6">Are you sure you want to delete the event "{{ eventToDelete?.title }}"? This action cannot be undone.</p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              @click="deleteEvent"
              :disabled="isDeleting"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEventStore } from '@/stores/event'
import { useTempleStore } from '@/stores/temple'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import EventForm from '@/components/event/EventForm.vue'
import api from '@/plugins/axios'

const route = useRoute()
const eventStore = useEventStore()
const templeStore = useTempleStore()
const authStore = useAuthStore()
const toast = useToast()

// Get templeId from route params
const templeId = computed(() =>
  route.params.id || route.params.templeId || route.query.templeId || localStorage.getItem('current_entity_id')
)

// Temple data
const temple = ref(null)

// Reactive state
const loading = ref(false)
const currentView = ref('list')
const showCreateEventModal = ref(false)
const showEditEventModal = ref(false)
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const selectedEvent = ref(null)
const eventToDelete = ref(null)
const searchTerm = ref('')
const showPermissionAlert = ref(false)
const filters = ref({
  status: 'all',
  category: 'all'
})

// Check if user is monitoring user
const isMonitoringUser = computed(() => {
  const role = (authStore.userRole || '').toLowerCase()
  const roleId = authStore.user?.roleId || authStore.user?.role_id
  // Check both role name and roleId (6 for monitoring_user)
  return role === 'monitoring_user' || role === 'monitoringuser' || roleId === 6 || roleId === '6'
})

// Computed properties
const eventStats = computed(() => eventStore.eventStats)
const allEvents = computed(() => eventStore.events)

// Filtered events based on search and filters
const filteredEvents = computed(() => {
  let result = allEvents.value;
  
  // Apply search term
  if (searchTerm.value.trim()) {
    const search = searchTerm.value.toLowerCase();
    result = result.filter(event => 
      event.title?.toLowerCase().includes(search) || 
      event.description?.toLowerCase().includes(search) ||
      event.location?.toLowerCase().includes(search)
    );
  }
  
  // Apply status filter
  if (filters.value.status !== 'all') {
    result = result.filter(event => {
      const status = getEventStatus(event).toLowerCase();
      return status === filters.value.status;
    });
  }
  
  // Apply category filter
  if (filters.value.category !== 'all') {
    result = result.filter(event => 
      (event.type || event.eventType)?.toLowerCase() === filters.value.category.toLowerCase()
    );
  }
  
  return result;
})

// Handle create event button click
const handleCreateEventClick = () => {
  if (isMonitoringUser.value) {
    showPermissionAlert.value = true
    toast.error('You are not allowed to create events. Monitoring users have view-only access.')
    
    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      showPermissionAlert.value = false
    }, 5000)
    
    return
  }
  
  showCreateEventModal.value = true
}

// Load temple data
const loadTempleData = async () => {
  try {
    
    const fetchedTemple = await templeStore.getTempleById(templeId.value)
    if (fetchedTemple) {
      temple.value = fetchedTemple
    }
  } catch (error) {
    console.error('Error loading temple data:', error)
    showToast('Failed to load temple details', 'error')
  }
}

// Load events on component mount
onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([
      loadTempleData(),
      eventStore.fetchEvents(templeId.value)
    ])
  } catch (error) {
    console.error('Error loading events:', error)
    toast.error('Failed to load events')
  } finally {
    loading.value = false
  }
})

// Methods
const applyFilters = () => {
  eventStore.setFilters(filters.value)
}

const debounceSearch = () => {
  applyFilters()
}

const handleEditEvent = (event) => {
  if (isMonitoringUser.value) {
    showPermissionAlert.value = true
    toast.error('You are not allowed to edit events. Monitoring users have view-only access.')
    return
  }
  
  selectedEvent.value = { ...event }
  showEditEventModal.value = true
}

const confirmDeleteEvent = (event) => {
  if (isMonitoringUser.value) {
    showPermissionAlert.value = true
    toast.error('You are not allowed to delete events. Monitoring users have view-only access.')
    return
  }
  
  eventToDelete.value = event
  showDeleteModal.value = true
}

const deleteEvent = async () => {
  if (!eventToDelete.value) return
  
  isDeleting.value = true
  try {
    await eventStore.deleteEvent(eventToDelete.value.id)
    await eventStore.fetchEvents(templeId.value)
    toast.success('Event deleted successfully')
    showDeleteModal.value = false
    eventToDelete.value = null
  } catch (error) {
    toast.error('Failed to delete event')
  } finally {
    isDeleting.value = false
  }
}

const handleSaveEvent = async (eventData) => {
  closeModals()
  
  setTimeout(async () => {
    try {
      await eventStore.fetchEvents(templeId.value);
    } catch (error) {
      console.error('Error refreshing events:', error)
    }
  }, 500)
}

const closeModals = () => {
  showCreateEventModal.value = false
  showEditEventModal.value = false
  selectedEvent.value = null
}

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatEventType = (type) => {
  if (!type) return 'Other'
  
  return type
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

const getTypeClass = (type) => {
  const typeMap = {
    'festival': 'bg-purple-100 text-purple-800',
    'ceremony': 'bg-blue-100 text-blue-800',
    'spiritual': 'bg-yellow-100 text-yellow-800',
    'cultural': 'bg-pink-100 text-pink-800',
    'community': 'bg-green-100 text-green-800',
    'special': 'bg-red-100 text-red-800'
  }
  
  return typeMap[type?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getEventStatus = (event) => {
  if (!event || !event.eventDate) return 'Unknown'
  
  const now = new Date()
  const eventDate = new Date(event.eventDate)
  const endDate = event.endDate ? new Date(event.endDate) : new Date(eventDate)
  endDate.setHours(23, 59, 59)
  
  if (now < eventDate) return 'Upcoming'
  if (now >= eventDate && now <= endDate) return 'Ongoing'
  return 'Completed'
}

const getStatusClass = (event) => {
  const status = getEventStatus(event)
  
  const statusMap = {
    'Upcoming': 'bg-blue-100 text-blue-800',
    'Ongoing': 'bg-green-100 text-green-800',
    'Completed': 'bg-gray-100 text-gray-700'
  }
  
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}

const formatEventTime = (event) => {
  if (event.eventTime && event.eventTime !== '00:00') {
    const [hours, minutes] = event.eventTime.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  }
  return formatTime(event.eventDate);
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  })
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
</script>