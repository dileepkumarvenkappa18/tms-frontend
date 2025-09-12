<!-- src/components/debug/TempleDebug.vue -->
<template>
  <div class="p-6 bg-gray-50 rounded-lg">
    <h3 class="text-lg font-semibold mb-4">🔍 Temple Filtering Debug</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- User Context -->
      <div class="bg-white p-4 rounded border">
        <h4 class="font-medium text-blue-600 mb-2">👤 User Context</h4>
        <div v-if="userContext" class="text-sm space-y-1">
          <p><strong>User ID:</strong> {{ userContext.id }}</p>
          <p><strong>User Type:</strong> {{ userContext.user_type }}</p>
          <p><strong>Temple ID:</strong> {{ userContext.temple_id }}</p>
          <p><strong>Entity ID:</strong> {{ userContext.entity_id }}</p>
          <p><strong>Role:</strong> {{ userContext.role }}</p>
        </div>
        <p v-else class="text-gray-500 text-sm">Loading user context...</p>
      </div>

      <!-- Sevas Summary -->
      <div class="bg-white p-4 rounded border">
        <h4 class="font-medium text-green-600 mb-2">🏛️ Sevas Summary</h4>
        <div class="text-sm space-y-1">
          <p><strong>Temple Sevas:</strong> {{ templeSevass?.length || 0 }}</p>
          <p><strong>Devotee Sevas:</strong> {{ devoteeSevas?.length || 0 }}</p>
          <p><strong>Match:</strong> 
            <span :class="templeSevass?.length === devoteeSevas?.length ? 'text-green-600' : 'text-red-600'">
              {{ templeSevass?.length === devoteeSevas?.length ? '✅ Yes' : '❌ No' }}
            </span>
          </p>
        </div>
      </div>

      <!-- Bookings Summary -->
      <div class="bg-white p-4 rounded border">
        <h4 class="font-medium text-purple-600 mb-2">📋 Bookings Summary</h4>
        <div class="text-sm space-y-1">
          <p><strong>Total Bookings:</strong> {{ userBookings?.length || 0 }}</p>
          <p><strong>Valid Temple Bookings:</strong> {{ validBookings }}</p>
          <p><strong>Invalid Bookings:</strong> 
            <span :class="invalidBookings > 0 ? 'text-red-600 font-semibold' : 'text-green-600'">
              {{ invalidBookings }}
            </span>
          </p>
        </div>
      </div>

      <!-- Seva IDs Comparison -->
      <div class="bg-white p-4 rounded border">
        <h4 class="font-medium text-orange-600 mb-2">🔢 Seva IDs Comparison</h4>
        <div class="text-xs space-y-2">
          <div>
            <strong>Temple Seva IDs:</strong>
            <div class="bg-blue-50 p-2 rounded mt-1">
              {{ templeSevass?.slice(0, 5)?.map(s => s.id).join(', ') || 'None' }}
            </div>
          </div>
          <div>
            <strong>Booking Seva IDs:</strong>
            <div class="bg-purple-50 p-2 rounded mt-1">
              {{ userBookings?.slice(0, 5)?.map(b => b.seva_id || b.SevaID).join(', ') || 'None' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex flex-wrap gap-2">
      <button 
        @click="runValidation"
        :disabled="loading"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loading ? 'Validating...' : '🔍 Run Validation' }}
      </button>
      
      <button 
        @click="testBookingFilter"
        :disabled="loading"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        🧪 Test Booking Filter
      </button>
      
      <button 
        @click="clearDebugData"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        🗑️ Clear Data
      </button>
    </div>

    <!-- Debug Log -->
    <div class="mt-6 bg-black text-green-400 p-4 rounded font-mono text-xs max-h-64 overflow-y-auto">
      <h5 class="text-white mb-2">Debug Log:</h5>
      <div v-for="(log, index) in debugLogs" :key="index" class="mb-1">
        {{ log }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { sevaService } from '@/services/seva.service'
import { useSevaStore } from '@/stores/seva'

// Reactive data
const loading = ref(false)
const userContext = ref(null)
const templeSevass = ref([])
const devoteeSevas = ref([])
const userBookings = ref([])
const debugLogs = ref([])

// Store
const sevaStore = useSevaStore()

// Computed
const validBookings = computed(() => {
  if (!userBookings.value || !templeSevass.value) return 0
  
  const templeSevaIds = new Set(templeSevass.value.map(s => s.id))
  return userBookings.value.filter(b => 
    templeSevaIds.has(b.seva_id || b.SevaID)
  ).length
})

const invalidBookings = computed(() => {
  return (userBookings.value?.length || 0) - validBookings.value
})

// Methods
const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value.unshift(`[${timestamp}] ${message}`)
  
  // Keep only last 20 logs
  if (debugLogs.value.length > 20) {
    debugLogs.value = debugLogs.value.slice(0, 20)
  }
}

const runValidation = async () => {
  loading.value = true
  addLog('🔍 Starting temple filtering validation...')
  
  try {
    const result = await sevaService.validateTempleFiltering()
    
    if (result.success) {
      userContext.value = result.userContext
      templeSevass.value = result.templeSevass || []
      devoteeSevas.value = result.devoteeSevas || []
      userBookings.value = result.userBookings || []
      
      addLog(`✅ Validation complete: ${templeSevass.value.length} temple sevas, ${userBookings.value.length} user bookings`)
      
      if (invalidBookings.value > 0) {
        addLog(`⚠️ Found ${invalidBookings.value} bookings for other temples!`)
      } else {
        addLog('✅ All bookings are for current temple')
      }
    } else {
      addLog(`❌ Validation failed: ${result.error}`)
    }
  } catch (error) {
    addLog(`❌ Validation error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const testBookingFilter = async () => {
  loading.value = true
  addLog('🧪 Testing booking filter method...')
  
  try {
    // Test the new filtering method
    const filteredBookings = await sevaStore.fetchRecentSevasWithTempleFilter()
    
    addLog(`✅ Filter test complete: ${filteredBookings.length} valid bookings`)
    
    // Compare with store's regular method
    const regularBookings = await sevaStore.fetchRecentSevas()
    
    addLog(`📊 Comparison: Regular=${regularBookings.length}, Filtered=${filteredBookings.length}`)
    
    if (filteredBookings.length !== regularBookings.length) {
      addLog(`⚠️ Filtering difference detected: ${regularBookings.length - filteredBookings.length} bookings filtered out`)
    }
    
  } catch (error) {
    addLog(`❌ Filter test error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const clearDebugData = () => {
  userContext.value = null
  templeSevass.value = []
  devoteeSevas.value = []
  userBookings.value = []
  debugLogs.value = []
  addLog('🗑️ Debug data cleared')
}

// Initialize
onMounted(() => {
  addLog('🚀 Temple Debug component initialized')
  runValidation()
})
</script>