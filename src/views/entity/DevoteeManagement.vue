<template>
  <div class="min-h-screen bg-gray-50/90">
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

    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-3">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900">Devotee Management</h1>
              <p class="mt-1 text-sm text-gray-600">Manage your temple's registered devotees</p>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="refreshData" :disabled="loading" class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <!-- Stats Overview -->
      <div class="mb-4">
        <DevoteeStats :stats="devoteeStore.devoteeStats" :loading="loading" />
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
        <div class="p-3">
          <div class="space-y-3">
            <!-- Search Bar -->
            <div class="flex items-center space-x-3">
              <div class="flex-1">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input v-model="searchQuery" type="text" placeholder="Search devotees by name, email, or phone..." class="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <select v-model="statusFilter" class="block w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select v-model="itemsPerPage" @change="resetPagination" class="block w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>
            </div>

            <!-- Spiritual Filters -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Nakshatra</label>
                <select v-model="spiritualFilters.nakshatra" @change="applyFilters" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                  <option value="">All Nakshatras</option>
                  <option v-for="nakshatra in nakshatraList" :key="nakshatra" :value="nakshatra">{{ nakshatra }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Rashi</label>
                <select v-model="spiritualFilters.rashi" @change="applyFilters" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                  <option value="">All Rashis</option>
                  <option v-for="rashi in rashiList" :key="rashi" :value="rashi">{{ rashi }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Lagna</label>
                <select v-model="spiritualFilters.lagna" @change="applyFilters" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                  <option value="">All Lagnas</option>
                  <option v-for="lagna in lagnaList" :key="lagna" :value="lagna">{{ lagna }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Veda Shaka</label>
                <select v-model="spiritualFilters.vedaShaka" @change="applyFilters" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                  <option value="">All Vedas</option>
                  <option v-for="veda in vedaShakaList" :key="veda" :value="veda">{{ veda }}</option>
                </select>
              </div>
            </div>

            <!-- Active Filters Display -->
            <div v-if="hasActiveFilters" class="flex items-center space-x-2 flex-wrap gap-2">
              <span class="text-xs text-gray-500 font-medium">Active Filters:</span>
              <span v-if="spiritualFilters.nakshatra" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Nakshatra: {{ spiritualFilters.nakshatra }}
                <button @click="spiritualFilters.nakshatra = ''; applyFilters()" class="ml-1 hover:text-purple-900">×</button>
              </span>
              <span v-if="spiritualFilters.rashi" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Rashi: {{ spiritualFilters.rashi }}
                <button @click="spiritualFilters.rashi = ''; applyFilters()" class="ml-1 hover:text-blue-900">×</button>
              </span>
              <span v-if="spiritualFilters.lagna" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Lagna: {{ spiritualFilters.lagna }}
                <button @click="spiritualFilters.lagna = ''; applyFilters()" class="ml-1 hover:text-green-900">×</button>
              </span>
              <span v-if="spiritualFilters.vedaShaka" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Veda: {{ spiritualFilters.vedaShaka }}
                <button @click="spiritualFilters.vedaShaka = ''; applyFilters()" class="ml-1 hover:text-orange-900">×</button>
              </span>
              <button @click="clearFilters" class="text-xs text-red-600 hover:text-red-800 font-medium">Clear All</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Devotee List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-3">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">All Devotees</h2>
              <p class="text-sm text-gray-600">
                Showing {{ paginationInfo.start }}-{{ paginationInfo.end }} of {{ paginationInfo.total }} devotees
              </p>
            </div>
          </div>

          <!-- Table View -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nakshatra</th>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rashi</th>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lagna</th>
                  <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="devotee in paginatedDevotees" :key="getDevoteeId(devotee)" class="hover:bg-gray-50">
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">#{{ getDevoteeId(devotee) }}</td>
                  <td class="px-3 py-2 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-7 w-7">
                        <div class="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span class="text-xs font-medium text-indigo-600">{{ getDevoteeName(devotee).charAt(0).toUpperCase() }}</span>
                        </div>
                      </div>
                      <div class="ml-2">
                        <div class="text-sm font-medium text-gray-900">{{ getDevoteeName(devotee) }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ devotee.email || 'Not provided' }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ devotee.phone || 'Not provided' }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    <span v-if="devotee.nakshatra" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                      {{ devotee.nakshatra }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    <span v-if="devotee.rashi" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      {{ devotee.rashi }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    <span v-if="devotee.lagna" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                      {{ devotee.lagna }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap">
                    <span :class="getStatusClass(devotee.status)" class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full">{{ devotee.status || 'active' }}</span>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-center text-sm font-medium">
                    <div class="flex items-center justify-center space-x-2">
                      <button
                        @click="viewDevoteeProfile(devotee)"
                        class="px-2 py-0.5 rounded text-xs text-blue-600 hover:text-blue-900 hover:bg-blue-50 border border-blue-300 transition-colors"
                        title="View Profile">
                        View Profile
                      </button>
                      <button
                        @click="handleToggleStatus(devotee)"
                        :disabled="statusUpdateLoading === getDevoteeId(devotee)"
                        :class="getToggleButtonClass(devotee.status)"
                        class="px-2 py-0.5 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        :title="getStatusToggleText(devotee.status)">
                        <span v-if="statusUpdateLoading === getDevoteeId(devotee)" class="flex items-center">
                          <svg class="animate-spin -ml-1 mr-1 h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </span>
                        <span v-else>{{ getStatusToggleText(devotee.status) }}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 bg-white px-3 py-2 mt-3">
            <div class="flex flex-1 justify-between sm:hidden">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing <span class="font-medium">{{ paginationInfo.start }}</span> to
                  <span class="font-medium">{{ paginationInfo.end }}</span> of
                  <span class="font-medium">{{ paginationInfo.total }}</span> results
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="sr-only">Previous</span>
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <template v-for="page in visiblePages" :key="page">
                    <button v-if="page !== '...'" @click="goToPage(page)" :class="['relative inline-flex items-center px-3 py-1.5 text-sm font-semibold focus:z-20 focus:outline-offset-0', page === currentPage ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50']">
                      {{ page }}
                    </button>
                    <span v-else class="relative inline-flex items-center px-3 py-1.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">...</span>
                  </template>
                  <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="sr-only">Next</span>
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="paginatedDevotees.length === 0 && !loading" class="text-center py-6">
            <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No devotees found</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ searchQuery || statusFilter || hasActiveFilters ? 'Try adjusting your search criteria or filters.' : 'No devotees have joined this temple yet.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-4 flex items-center space-x-3">
        <BaseLoader size="sm" />
        <span class="text-gray-700">Loading devotees...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useDevoteeStore } from '@/stores/devotee'
import { useTempleStore } from '@/stores/temple'
import { storeToRefs } from 'pinia'
import api from '@/plugins/axios'

// Components
import DevoteeStats from '@/components/devotee/DevoteeStats.vue'
import BaseLoader from '@/components/common/BaseLoader.vue'

export default {
  name: 'DevoteeManagement',
  components: {
    DevoteeStats,
    BaseLoader
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    const devoteeStore = useDevoteeStore()
    const templeStore = useTempleStore()
    const { devotees } = storeToRefs(devoteeStore)

    // Reactive data
    const temple = ref(null)
    const loading = ref(false)
    const statusUpdateLoading = ref(null)
    const searchQuery = ref('')
    const statusFilter = ref('')

    // Spiritual filters
    const spiritualFilters = ref({
      nakshatra: '',
      rashi: '',
      lagna: '',
      vedaShaka: ''
    })

    // Pagination state
    const currentPage = ref(1)
    const itemsPerPage = ref(25)

    // Filter options
    const nakshatraList = ref([
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 
      'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 
      'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 
      'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 
      'Uttara Bhadrapada', 'Revati'
    ])

    const rashiList = ref([
      'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
      'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
      'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
    ])

    const lagnaList = ref([
      'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
      'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
    ])

    const vedaShakaList = ref([
      'Rigveda - Shakala', 'Yajurveda - Krishna', 'Yajurveda - Shukla',
      'Samaveda - Kauthuma', 'Samaveda - Jaiminiya', 'Atharvaveda - Shaunaka'
    ])

    // Get entity ID from route
    const templeId = computed(() => {
      const id = route.params.id || route.params.templeId || route.query.templeId || localStorage.getItem('current_entity_id')
      return id ? parseInt(id, 10) : null
    })

    // Check if any spiritual filters are active
    const hasActiveFilters = computed(() => {
      return spiritualFilters.value.nakshatra || 
             spiritualFilters.value.rashi || 
             spiritualFilters.value.lagna || 
             spiritualFilters.value.vedaShaka
    })

    // Computed - Filtered devotees
    const filteredDevotees = computed(() => {
      let devotees = devoteeStore.devotees || []

      // Apply search
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        devotees = devotees.filter(devotee =>
          getDevoteeName(devotee)?.toLowerCase().includes(query) ||
          devotee.email?.toLowerCase().includes(query) ||
          devotee.phone?.toLowerCase().includes(query)
        )
      }

      // Apply status filter
      if (statusFilter.value) {
        devotees = devotees.filter(devotee =>
          (devotee.status || 'active') === statusFilter.value
        )
      }

      // Apply spiritual filters
      if (spiritualFilters.value.nakshatra) {
        devotees = devotees.filter(devotee =>
          devotee.nakshatra === spiritualFilters.value.nakshatra
        )
      }

      if (spiritualFilters.value.rashi) {
        devotees = devotees.filter(devotee =>
          devotee.rashi === spiritualFilters.value.rashi
        )
      }

      if (spiritualFilters.value.lagna) {
        devotees = devotees.filter(devotee =>
          devotee.lagna === spiritualFilters.value.lagna
        )
      }

      if (spiritualFilters.value.vedaShaka) {
        devotees = devotees.filter(devotee =>
          devotee.veda_shaka === spiritualFilters.value.vedaShaka
        )
      }

      return devotees
    })

    // Pagination computed properties
    const totalPages = computed(() => {
      return Math.ceil(filteredDevotees.value.length / itemsPerPage.value)
    })

    const paginatedDevotees = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredDevotees.value.slice(start, end)
    })

    const paginationInfo = computed(() => {
      const start = filteredDevotees.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
      const end = Math.min(currentPage.value * itemsPerPage.value, filteredDevotees.value.length)
      const total = filteredDevotees.value.length
      return { start, end, total }
    })

    const visiblePages = computed(() => {
      const total = totalPages.value
      const current = currentPage.value
      const delta = 2

      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
      }

      const pages = []
      pages.push(1)

      if (current - delta > 2) {
        pages.push('...')
      }

      const start = Math.max(2, current - delta)
      const end = Math.min(total - 1, current + delta)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (current + delta < total - 1) {
        pages.push('...')
      }

      if (total > 1) {
        pages.push(total)
      }

      return pages
    })

    // Watch for filter changes and reset pagination
    watch([searchQuery, statusFilter, spiritualFilters], () => {
      currentPage.value = 1
    }, { deep: true })

    // Helper methods
    const getDevoteeId = (devotee) => {
      return devotee.user_id || devotee.id || 'unknown'
    }

    const getDevoteeName = (devotee) => {
      return devotee.full_name || devotee.fullName || 'Unknown'
    }

    const getStatusClass = (status) => {
      switch (status || 'active') {
        case 'active':
          return 'bg-green-100 text-green-800'
        case 'inactive':
          return 'bg-red-100 text-red-800'
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const getToggleButtonClass = (status) => {
      return (status || 'active') === 'active'
        ? 'text-red-600 hover:text-red-900 hover:bg-red-50 border border-red-300'
        : 'text-green-600 hover:text-green-900 hover:bg-green-50 border border-green-300'
    }

    const getStatusToggleText = (status) => {
      return (status || 'active') === 'active' ? 'Deactivate' : 'Activate'
    }

    // View devotee profile
    const viewDevoteeProfile = (devotee) => {
      const userId = getDevoteeId(devotee)
      if (!userId || userId === 'unknown') {
        toast.error('Invalid devotee ID')
        return
      }

      console.log('🔍 Navigating to profile:', {
        entityId: templeId.value,
        userId: userId
      })

      router.push({
        name: 'devotee-profile',
        params: {
          id: templeId.value,
          devoteeId: userId
        }
      })
    }

    // Clear all filters
    const clearFilters = () => {
      spiritualFilters.value = {
        nakshatra: '',
        rashi: '',
        lagna: '',
        vedaShaka: ''
      }
      searchQuery.value = ''
      statusFilter.value = ''
      currentPage.value = 1
    }

    // Apply filters
    const applyFilters = () => {
      currentPage.value = 1
    }

    // Pagination methods
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const resetPagination = () => {
      currentPage.value = 1
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
    toast.error('Failed to load temple details')
  }
}

    // Data loading methods
    const loadDevotees = async () => {
      if (!templeId.value) return
      try {
        await devoteeStore.fetchDevoteesByEntity(templeId.value)
      } catch (error) {
        console.error('Error loading devotees:', error)
        toast.error('Failed to load devotees')
      }
    }

    const loadDevoteeStats = async () => {
      if (!templeId.value) return
      try {
        await devoteeStore.fetchDevoteeStats(templeId.value)
      } catch (error) {
        console.error('Error loading devotee stats:', error)
        toast.error('Failed to load devotee statistics')
      }
    }

    const refreshData = async () => {
      loading.value = true
      try {
        await Promise.all([
          loadDevotees(),
          loadDevoteeStats()
        ])
      } catch (error) {
        console.error('Error refreshing data:', error)
      } finally {
        loading.value = false
      }
    }

    // Status toggle handler
    const handleToggleStatus = async (devotee) => {
      if (!templeId.value) {
        console.error('❌ No temple ID available')
        toast.error('Temple ID is missing')
        return
      }

      const devoteeId = getDevoteeId(devotee)
      const currentStatus = devotee.status || 'active'
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

      if (!devoteeId || devoteeId === 'unknown') {
        console.error('❌ Invalid devotee ID')
        toast.error('Invalid devotee ID')
        return
      }

      console.log('🔄 Toggling status:', {
        templeId: templeId.value,
        templeIdType: typeof templeId.value,
        devoteeId,
        devoteeIdType: typeof devoteeId,
        currentStatus,
        newStatus
      })

      statusUpdateLoading.value = devoteeId

      try {
        // Direct API call with proper payload structure
        console.log('📡 Making API call to:', `/entities/${templeId.value}/devotees/${devoteeId}/status`)
        
        const response = await api.patch(`/entities/${templeId.value}/devotees/${devoteeId}/status`, {
          entity_id: parseInt(templeId.value, 10),
          user_id: parseInt(devoteeId, 10),
          status: newStatus
        })
        
        console.log('✅ API Response:', response.data)
        
        // Reload data
        await loadDevotees()
        await loadDevoteeStats()
        
        toast.success(`Devotee ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
        console.log('✅ Status updated successfully')
      } catch (error) {
        console.error('❌ Error updating status:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          requestData: {
            entity_id: parseInt(templeId.value, 10),
            user_id: parseInt(devoteeId, 10),
            status: newStatus
          }
        })
        
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.message || 
                            error.message || 
                            'Failed to update devotee status'
        toast.error(errorMessage)
      } finally {
        statusUpdateLoading.value = null
      }
    }

    // Lifecycle
    onMounted(async () => {
      if (!templeId.value) {
        toast.error('Invalid temple ID')
        router.push('/dashboard')
        return
      }

      loading.value = true
      try {
        await Promise.all([
          loadTempleData(),
          loadDevotees(),
          loadDevoteeStats()
        ])
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load data')
      } finally {
        loading.value = false
      }
    })

    return {
      temple,
      devoteeStore,
      loading,
      statusUpdateLoading,
      searchQuery,
      statusFilter,
      spiritualFilters,
      currentPage,
      itemsPerPage,
      totalPages,
      paginatedDevotees,
      paginationInfo,
      visiblePages,
      filteredDevotees,
      hasActiveFilters,
      nakshatraList,
      rashiList,
      lagnaList,
      vedaShakaList,
      getDevoteeId,
      getDevoteeName,
      getStatusClass,
      getToggleButtonClass,
      getStatusToggleText,
      viewDevoteeProfile,
      clearFilters,
      applyFilters,
      handleToggleStatus,
      refreshData,
      goToPage,
      resetPagination
    }
  }
}
</script>