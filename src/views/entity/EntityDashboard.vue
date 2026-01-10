<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with Temple Info -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <!-- Temple Logo -->
            <div v-if="templeLogo" class="h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-200">
              <img :src="templeLogo" :alt="temple?.name || 'Temple'" class="h-full w-full object-cover" />
            </div>
            <div v-else class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ temple ? temple.name : 'Loading...' }}</h2>
              <p class="text-sm text-gray-500">{{ temple ? `${temple.city}, ${temple.state}` : 'Loading location...' }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Temple Video Button -->
            <button 
              v-if="templeVideo"
              @click="showVideoModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Watch Temple Video
            </button>
            
            <button class="relative p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span v-if="notifications.length > 0" class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">{{ notifications.length }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <transition name="modal">
      <div v-if="showVideoModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="showVideoModal = false">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" @click="showVideoModal = false"></div>

          <!-- Modal panel -->
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">Temple Video</h3>
                <button 
                  @click="showVideoModal = false"
                  class="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div class="aspect-video bg-black rounded-lg overflow-hidden">
                <video 
                  v-if="templeVideo"
                  :src="templeVideo" 
                  controls 
                  class="w-full h-full"
                  @error="handleVideoError"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="showVideoModal = false"
                class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-white mb-2">Welcome back, {{ user ? user.fullName : 'Admin' }}!</h3>
            <p class="text-indigo-100">Here's what's happening at your temple today</p>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-32 hover:shadow-md transition-shadow duration-200">
          <div class="animate-pulse flex items-center">
            <div class="h-12 w-12 bg-gray-200 rounded-lg mr-4"></div>
            <div class="space-y-2 flex-1">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-6 bg-gray-200 rounded w-1/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Registered Devotees -->
        <router-link :to="{ name: 'DevoteeManagement', params: { id: $route.params.id } }" class="block">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-32 hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Registered Devotees</p>
                <p class="text-2xl font-bold text-gray-900">{{ dashboardData.devotees?.total || 0 }}</p>
                <p class="text-xs text-green-600">+{{ dashboardData.devotees?.newThisMonth || 0 }} this month</p>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Seva Bookings -->
        <router-link :to="{ name: 'SevaManagement', params: { id: $route.params.id } }" class="block">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-32 hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Seva Bookings</p>
                <div class="flex items-baseline">
                  <p class="text-2xl font-bold text-gray-900">{{ dashboardData.sevas?.today || 0 }}</p>
                  <span class="text-sm text-gray-500 ml-1">today</span>
                </div>
                <p class="text-xs text-blue-600">{{ dashboardData.sevas?.thisMonth || 0 }} this month</p>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Donations -->
        <router-link :to="{ name: 'DonationManagement', params: { id: $route.params.id } }" class="block">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-32 hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div class="flex items-center h-full">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex flex-col">
                <p class="text-sm font-medium text-gray-600 whitespace-nowrap">Month Donations</p>
                <p class="text-2xl font-bold text-gray-900">₹{{ formatCurrency(dashboardData.donations?.thisMonth || 0) }}</p>
                <p class="text-xs text-green-600 mb-4">+{{ dashboardData.donations?.growth || 0 }}% from last month</p>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Upcoming Events -->
        <router-link :to="{ name: 'EventManagement', params: { id: $route.params.id } }" class="block">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-32 hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p class="text-2xl font-bold text-gray-900">{{ dashboardData.events?.upcoming || 0 }}</p>
                <p class="text-xs text-purple-600">{{ dashboardData.events?.thisWeek || 0 }} this week</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Quick Actions -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <router-link :to="`/entity/${entityId}/sevas`" 
                           class="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 group">
                  <div class="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                    <svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Manage Sevas</p>
                    <p class="text-xs text-gray-500">Create and approve sevas</p>
                  </div>
                </router-link>

                <router-link :to="`/entity/${entityId}/events`" 
                           class="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 group">
                  <div class="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                    <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Create Event</p>
                    <p class="text-xs text-gray-500">Schedule temple events</p>
                  </div>
                </router-link>

                <router-link :to="`/entity/${entityId}/devotees`" 
                           class="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 group">
                  <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                    <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">View Devotees</p>
                    <p class="text-xs text-gray-500">Manage devotee profiles</p>
                  </div>
                </router-link>

                <!-- Send Message - Disabled for Monitoring Users -->
                <div 
                  v-if="isMonitoringUser"
                  class="flex items-center p-4 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed opacity-60 relative group"
                  :title="isMonitoringUser ? 'Monitoring users are not allowed to send messages' : ''"
                >
                  <div class="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-600">Send Message</p>
                    <p class="text-xs text-gray-400">Communicate with devotees</p>
                  </div>
                  <div class="absolute -top-8 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Restricted for monitoring users
                  </div>
                </div>

                <!-- Send Message - Enabled for Regular Users -->
                <router-link 
                  v-else
                  :to="`/entity/${entityId}/communication`" 
                  class="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 group">
                  <div class="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                    <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Send Message</p>
                    <p class="text-xs text-gray-500">Communicate with devotees</p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Upcoming Events -->
        <div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                <router-link 
                  :to="`/entity/${entityId}/events`" 
                  class="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
                  View All
                </router-link>
              </div>
            </div>
            <div class="p-6">
              <div v-if="upcomingEvents.length === 0" class="text-center py-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="mt-2 text-sm text-gray-500">No upcoming events</p>
                <router-link :to="`/entity/${entityId}/events`" 
                           class="mt-1 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Create Event
                </router-link>
              </div>
              <div v-else class="space-y-4">
                <div v-for="event in upcomingEvents.slice(0, 3)" :key="event.id" 
                     class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span class="text-xs font-semibold text-purple-600">{{ formatEventDate(event.date) }}</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
                    <p class="text-xs text-gray-500">{{ formatFullDate(event.date) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Donors -->
      <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Top Donors</h3>
            <router-link 
              :to="`/entity/${entityId}/donations`" 
              class="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
              View All
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div v-if="topDonors.length === 0" class="text-center py-4">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">No donations yet</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="(donor, index) in topDonors.slice(0, 5)" :key="donor.id || donor.email || index" 
                 class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span class="text-xs font-bold text-white">{{ index + 1 }}</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ donor.name || 'Unknown Donor' }}</p>
                <p class="text-xs text-gray-500">{{ donor.totalDonations || donor.donation_count || 0 }} donations</p>
              </div>
              <div class="text-sm font-semibold text-green-600">
                ₹{{ formatCurrency(donor.amount || donor.total_amount || 0) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTempleStore } from '@/stores/temple'
import { useToast } from '@/composables/useToast'
import api from '@/plugins/axios'
import { donationService } from '@/services/donation.service'

const route = useRoute()
const entityId = computed(() => route.params.id)
const authStore = useAuthStore()
const templeStore = useTempleStore()
const toast = useToast()

const user = computed(() => authStore.user)
const temple = ref(null)
const loading = ref(true)
const dashboardData = ref({
  devotees: { total: 0, newThisMonth: 0 },
  sevas: { today: 0, thisMonth: 0 },
  donations: { thisMonth: 0, growth: 0 },
  events: { upcoming: 0, thisWeek: 0 }
})

const notifications = ref([])
const upcomingEvents = ref([])
const topDonors = ref([])

// Check if user is monitoring user - Same logic as Event page
const isMonitoringUser = computed(() => {
  const role = (authStore.userRole || '').toLowerCase()
  const roleId = authStore.user?.roleId || authStore.user?.role_id
  // Check both role name and roleId (6 for monitoring_user)
  return role === 'monitoring_user' || role === 'monitoringuser' || roleId === 6 || roleId === '6'
})

const loadEntityData = async () => {
  try {
    loading.value = true
    console.log('Loading entity data for ID:', entityId.value)
    
    // FIX: getTempleById is async, so we need to await it
    try {
      const fetchedTemple = await templeStore.getTempleById(entityId.value)
      if (fetchedTemple) {
        console.log('Found temple from store:', fetchedTemple)
        temple.value = fetchedTemple
      }
    } catch (err) {
      console.error('Failed to fetch temple details:', err)
      toast.error('Failed to load temple details')
    }
    
   
    try {
      const dashboardResponse = await api.get(`/entities/dashboard-summary?entity_id=${entityId.value}`)
      
      if (dashboardResponse && dashboardResponse.data) {
        dashboardData.value = {
          devotees: {
            total: dashboardResponse.data.registered_devotees.total || 0,
            newThisMonth: dashboardResponse.data.registered_devotees.this_month || 0
          },
          sevas: {
            today: dashboardResponse.data.seva_bookings.today || 0,
            thisMonth: dashboardResponse.data.seva_bookings.this_month || 0
          },
          donations: {
            thisMonth: dashboardResponse.data.month_donations.amount || 0,
            growth: dashboardResponse.data.month_donations.percent_change || 0
          },
          events: {
            upcoming: dashboardResponse.data.upcoming_events.total || 0,
            thisWeek: dashboardResponse.data.upcoming_events.this_week || 0
          }
        }
        console.log('Dashboard data loaded successfully:', dashboardData.value)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      toast.error('Failed to load dashboard statistics')
    }
    
    try {
      const eventsResponse = await api.get(`/events/upcoming?entity_id=${entityId.value}&limit=3`)
      
      if (eventsResponse && eventsResponse.data) {
        upcomingEvents.value = eventsResponse.data.map(event => ({
          ...event,
          date: new Date(event.event_date || event.date || Date.now())
        }))
        dashboardData.value.events.upcoming = upcomingEvents.value.length
      }
    } catch (err) {
      console.error('Failed to fetch upcoming events:', err)
      upcomingEvents.value = []
    }
    
    try {
      console.log('Fetching top donors...')
      const donorsResponse = await donationService.getTopDonors(5)
      console.log('Top donors response:', donorsResponse)
      
      if (donorsResponse && donorsResponse.success && Array.isArray(donorsResponse.data)) {
        topDonors.value = donorsResponse.data.map(donor => ({
          id: donor.email || Math.random(),
          name: donor.name || 'Unknown Donor',
          email: donor.email || '',
          amount: donor.total_amount || donor.totalAmount || 0,
          totalDonations: donor.donation_count || donor.donationCount || 0
        }))
      } else if (Array.isArray(donorsResponse.data)) {
        topDonors.value = donorsResponse.data.map(donor => ({
          id: donor.email || Math.random(),
          name: donor.name || 'Unknown Donor',
          email: donor.email || '',
          amount: donor.total_amount || donor.totalAmount || 0,
          totalDonations: donor.donation_count || donor.donationCount || 0
        }))
      } else if (Array.isArray(donorsResponse)) {
        topDonors.value = donorsResponse.map(donor => ({
          id: donor.email || Math.random(),
          name: donor.name || 'Unknown Donor',
          email: donor.email || '',
          amount: donor.total_amount || donor.totalAmount || 0,
          totalDonations: donor.donation_count || donor.donationCount || 0
        }))
      } else {
        console.warn('Unexpected top donors response format:', donorsResponse)
        topDonors.value = []
      }
      
      console.log('Final top donors data:', topDonors.value)
    } catch (err) {
      console.error('Failed to fetch top donors:', err)
      topDonors.value = []
      if (err.response?.status !== 404) {
        toast.error('Failed to load top donors')
      }
    }
    
  } catch (err) {
    console.error('Error loading entity data:', err)
    toast.error('Failed to load entity data')
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const formatTimeAgo = (date) => {
  if (!date) return ''
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    return `${days}d ago`
  }
}

const formatEventDate = (date) => {
  if (!date) return ''
  return date.getDate().toString()
}

const formatFullDate = (date) => {
  if (!date) return ''
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const getNotificationIconClass = (type) => {
  const classes = {
    seva: 'bg-orange-100 text-orange-600',
    donation: 'bg-green-100 text-green-600',
    event: 'bg-purple-100 text-purple-600',
    devotee: 'bg-blue-100 text-blue-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const getNotificationIconPath = (type) => {
  const paths = {
    seva: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    donation: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    devotee: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
  }
  return paths[type] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
}

onMounted(() => {
  console.log('EntityDashboard mounted for entity:', entityId.value)
  loadEntityData()
})
</script>