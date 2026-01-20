<!-- src/views/tenant/TenantProfile.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <BaseCard class="mb-6">
        <div class="flex items-center justify-between p-6">
          <div class="flex items-center gap-4">
            <div class="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-full">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 8h2V9h-2v8z" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-800">Tenant Profile</h1>
              <p class="text-gray-600">Manage your tenant and temple information</p>
            </div>
          </div>
          
          <BaseButton
            v-if="!isEditing"
            @click="startEditing"
            variant="primary"
            size="lg"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </BaseButton>
        </div>
      </BaseCard>

      <!-- Alert Messages -->
      <div v-if="error" class="mb-6">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-red-800">Error</h3>
            <p class="text-red-600">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-if="successMessage" class="mb-6">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-green-800">Success</h3>
            <p class="text-green-600">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <BaseCard v-if="loading" class="p-12 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading profile...</p>
      </BaseCard>

      <!-- Profile Form -->
      <form v-else @submit.prevent="handleSubmit">
        <!-- User Information -->
        <BaseCard class="mb-6">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-6">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 class="text-xl font-bold text-gray-800">User Information</h2>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <BaseInput
                  v-model="formData.full_name"
                  type="text"
                  :disabled="!isEditing"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <BaseInput
                  v-model="formData.phone"
                  type="tel"
                  :disabled="!isEditing"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div class="relative">
                  <BaseInput
                    :model-value="profile?.user?.email || ''"
                    type="email"
                    disabled
                  />
                  <svg class="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <BaseInput
                  :model-value="profile?.user?.role || ''"
                  type="text"
                  disabled
                />
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Temple Information -->
        <BaseCard class="mb-6">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-6">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 8h2V9h-2v8z" />
              </svg>
              <h2 class="text-xl font-bold text-gray-800">Temple Information</h2>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Name
                </label>
                <BaseInput
                  v-model="formData.temple_name"
                  type="text"
                  :disabled="!isEditing"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Place
                </label>
                <BaseInput
                  v-model="formData.temple_place"
                  type="text"
                  :disabled="!isEditing"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Address
                </label>
                <textarea
                  v-model="formData.temple_address"
                  rows="3"
                  :disabled="!isEditing"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:text-gray-600"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Phone Number
                </label>
                <BaseInput
                  v-model="formData.temple_phone_no"
                  type="tel"
                  :disabled="!isEditing"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Description
                </label>
                <textarea
                  v-model="formData.temple_description"
                  rows="4"
                  :disabled="!isEditing"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:text-gray-600"
                ></textarea>
              </div>

              <!-- Temple Logo Upload -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Logo
                </label>

                <div v-if="logoPreview || currentLogoUrl" class="mb-3">
                  <img
                    :src="logoPreview || currentLogoUrl"
                    alt="Temple Logo"
                    class="h-32 w-auto rounded-lg border shadow-sm"
                    @error="handleImageError"
                  />
                </div>

                <p v-else-if="!isEditing" class="text-gray-400 text-sm mb-3">
                  No logo uploaded
                </p>

                <div v-if="isEditing" class="flex items-center gap-3">
                  <input
                    ref="logoInput"
                    type="file"
                    accept="image/*"
                    @change="handleLogoChange"
                    class="hidden"
                  />
                  
                  <BaseButton
                    type="button"
                    @click="$refs.logoInput.click()"
                    variant="secondary"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ logoFile ? 'Change Logo' : 'Upload Logo' }}
                  </BaseButton>

                  <BaseButton
                    v-if="logoPreview || currentLogoUrl"
                    type="button"
                    @click="removeLogo"
                    variant="secondary"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </BaseButton>

                  <span v-if="logoFile" class="text-sm text-gray-600">
                    {{ logoFile.name }}
                  </span>
                </div>

                <p class="mt-2 text-xs text-gray-500">
                  Recommended: PNG or JPG, max 5MB
                </p>
              </div>

              <!-- Temple Video Upload -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Introduction Video
                </label>

                <div v-if="videoPreview || currentVideoUrl" class="mb-3">
                  <video
                    :src="videoPreview || currentVideoUrl"
                    controls
                    class="w-full max-w-md rounded-lg border shadow-sm"
                    @error="handleVideoError"
                  ></video>
                </div>

                <p v-else-if="!isEditing" class="text-gray-400 text-sm mb-3">
                  No video uploaded
                </p>

                <div v-if="isEditing" class="flex items-center gap-3">
                  <input
                    ref="videoInput"
                    type="file"
                    accept="video/*"
                    @change="handleVideoChange"
                    class="hidden"
                  />
                  
                  <BaseButton
                    type="button"
                    @click="$refs.videoInput.click()"
                    variant="secondary"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {{ videoFile ? 'Change Video' : 'Upload Video' }}
                  </BaseButton>

                  <BaseButton
                    v-if="videoPreview || currentVideoUrl"
                    type="button"
                    @click="removeVideo"
                    variant="secondary"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </BaseButton>

                  <span v-if="videoFile" class="text-sm text-gray-600">
                    {{ videoFile.name }}
                  </span>
                </div>

                <p class="mt-2 text-xs text-gray-500">
                  Recommended: MP4 format, max 50MB
                </p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- 🆕 Bank Account Details -->
        <BaseCard class="mb-6">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-6">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h2 class="text-xl font-bold text-gray-800">Bank Account Details</h2>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name
                </label>
                <BaseInput
                  v-model="formData.account_holder_name"
                  type="text"
                  :disabled="!isEditing"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <BaseInput
                  v-model="formData.account_number"
                  type="text"
                  :disabled="!isEditing"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <BaseInput
                  v-model="formData.bank_name"
                  type="text"
                  :disabled="!isEditing"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name
                </label>
                <BaseInput
                  v-model="formData.branch_name"
                  type="text"
                  :disabled="!isEditing"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code
                </label>
                <BaseInput
                  v-model="formData.ifsc_code"
                  type="text"
                  :disabled="!isEditing"
                  class="uppercase"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  v-model="formData.account_type"
                  :disabled="!isEditing"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-600"
                >
                  <option value="">Select account type</option>
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID <span class="text-gray-400 text-xs">(Optional)</span>
                </label>
                <BaseInput
                  v-model="formData.upi_id"
                  type="text"
                  :disabled="!isEditing"
                  placeholder="yourname@bank"
                />
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Action Buttons -->
        <BaseCard v-if="isEditing">
          <div class="flex gap-4 justify-end p-6">
            <BaseButton
              type="button"
              @click="cancelEditing"
              :disabled="saving || uploading"
              variant="secondary"
              size="lg"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </BaseButton>
            
            <BaseButton
              type="submit"
              :disabled="saving || uploading"
              :loading="saving || uploading"
              variant="primary"
              size="lg"
            >
              <svg v-if="!saving && !uploading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes' }}
            </BaseButton>
          </div>
        </BaseCard>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const { success, error: showError } = useToast()

// Helper function to convert relative URLs to proper URLs
// Since baseURL is '/api/v1', we need to handle media files differently
//const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL

const getMediaUrl = (path) => {
  let test
  if (!path) return ''

  // If already absolute
  if (path.startsWith('http')) {  
    test = convertToHttps(path)
    console.log("test: ",test)
    return test
  }

  // ✅ Backend already serves /uploads/*  
  console.log("getMediaUrl BACKEND_URL: ",BACKEND_URL)
  console.log("getMediaUrl path: ",path)
  test = convertToHttps(`${BACKEND_URL}${path}`)
  console.log("test: ",test)
  return test
}

function convertToHttps(url) {
    const parsedUrl = new URL(url);
    //parsedUrl.protocol = 'https:';  // Set protocol to https
    parsedUrl.protocol = window.location.protocol
    return parsedUrl.href;  // Return the modified URL
}

// State
const profile = ref(null)
const isEditing = ref(false)
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const error = ref('')
const successMessage = ref('')

// File upload states
const logoFile = ref(null)
const videoFile = ref(null)
const logoPreview = ref('')
const videoPreview = ref('')
const logoInput = ref(null)
const videoInput = ref(null)

const formData = ref({
  full_name: '',
  phone: '',
  temple_name: '',
  temple_place: '',
  temple_address: '',
  temple_phone_no: '',
  temple_description: '',
  logo_url: '',
  intro_video_url: '',
  // 🆕 Bank details
  account_holder_name: '',
  account_number: '',
  bank_name: '',
  branch_name: '',
  ifsc_code: '',
  account_type: '',
  upi_id: ''
})

const currentLogoUrl = computed(() => {
    console.log("getMediaUrl formData.value.logo_url: ",formData.value.logo_url)
    return getMediaUrl(formData.value.logo_url)
  }
)

const currentVideoUrl = computed(() => {
    console.log("getMediaUrl formData.value.video_url: ",formData.value.intro_video_url)
    return getMediaUrl(formData.value.intro_video_url)
  }
)

// Error handlers
const handleImageError = (event) => {
  console.error('❌ Error loading logo:', event.target.src)
  showError('Failed to load temple logo')
}

const handleVideoError = (event) => {
  console.error('❌ Error loading video:', event.target.src)
  showError('Failed to load temple video')
}

// File Upload Methods
const handleLogoChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showError('Please select a valid image file')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    showError('Logo file size must be less than 5MB')
    return
  }

  logoFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleVideoChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('video/')) {
    showError('Please select a valid video file')
    return
  }

  if (file.size > 50 * 1024 * 1024) {
    showError('Video file size must be less than 50MB')
    return
  }

  videoFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    videoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeLogo = () => {
  logoFile.value = null
  logoPreview.value = ''
  formData.value.logo_url = ''
  if (logoInput.value) {
    logoInput.value.value = ''
  }
}

const removeVideo = () => {
  videoFile.value = null
  videoPreview.value = ''
  formData.value.intro_video_url = ''
  if (videoInput.value) {
    videoInput.value.value = ''
  }
}

const uploadFile = async (file, type) => {
  const uploadFormData = new FormData()
  uploadFormData.append('file', file)
  uploadFormData.append('type', type)

  try {
    const response = await api.post('/tenant/upload', uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data.url
  } catch (err) {
    console.error(`❌ Error uploading ${type}:`, err)
    throw err
  }
}

// Methods
const fetchProfile = async () => {
  try {
    loading.value = true
    error.value = ''

    console.log('📡 Fetching account details...')

    // Change endpoint to auth endpoint
    const response = await api.get('/auth/account/details')

    console.log('✅ Profile data received:', response.data)
    const accountData = response.data.data // Note the .data.data structure
    profile.value = accountData
    
    // Populate form data
    formData.value = {
      full_name: accountData.user?.full_name || '',
      phone: accountData.user?.phone || '',
      temple_name: accountData.temple?.temple_name || '',
      temple_place: accountData.temple?.temple_place || '',
      temple_address: accountData.temple?.temple_address || '',
      temple_phone_no: accountData.temple?.temple_phone_no || '',
      temple_description: accountData.temple?.temple_description || '',
      logo_url: accountData.temple?.logo_url || '',
      intro_video_url: accountData.temple?.intro_video_url || '',
      // Bank details
      account_holder_name: accountData.bank?.account_holder_name || '',
      account_number: accountData.bank?.account_number || '',
      bank_name: accountData.bank?.bank_name || '',
      branch_name: accountData.bank?.branch_name || '',
      ifsc_code: accountData.bank?.ifsc_code || '',
      account_type: accountData.bank?.account_type || '',
      upi_id: accountData.bank?.upi_id || ''
    }

    console.log('✅ Form data populated:', formData.value)
    console.log('🖼️ 1Logo URL:', formData.value.logo_url)
    console.log('🎥 1Video URL:', formData.value.intro_video_url)

    console.log('🖼️ 2Logo URL:', currentLogoUrl.value)
    console.log('🎥 2Video URL:', currentVideoUrl.value)
  } catch (err) {
    console.error('❌ Error fetching profile:', err)
    console.error('❌ Error response:', err.response?.data)
    
    const errorMsg = err.response?.data?.error || 
                     err.response?.data?.details || 
                     err.message || 
                     'Failed to fetch profile'
    
    error.value = errorMsg
    showError(errorMsg)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = ''
  successMessage.value = ''

  try {
    // Upload files if selected
    if (logoFile.value || videoFile.value) {
      uploading.value = true
    }

    if (logoFile.value) {
      console.log('📤 Uploading logo...')
      const logoUrl = await uploadFile(logoFile.value, 'logo')
      formData.value.logo_url = logoUrl
      console.log('✅ Logo uploaded:', logoUrl)
    }

    if (videoFile.value) {
      console.log('📤 Uploading video...')
      const videoUrl = await uploadFile(videoFile.value, 'video')
      formData.value.intro_video_url = videoUrl
      console.log('✅ Video uploaded:', videoUrl)
    }

    uploading.value = false

    console.log('📤 Updating account details with data:', formData.value)

    // Change endpoint to auth endpoint
    const response = await api.put('/auth/account/details', formData.value)

    console.log('✅ Update response:', response.data)
    profile.value = response.data.data
    successMessage.value = response.data.message || 'Account details updated successfully!'
    success(successMessage.value)
    isEditing.value = false
    
    // Reset file uploads
    logoFile.value = null
    videoFile.value = null
    logoPreview.value = ''
    videoPreview.value = ''
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('❌ Error updating account details:', err)
    console.error('❌ Error response:', err.response?.data)
    
    const errorMsg = err.response?.data?.error || 
                     err.response?.data?.details || 
                     err.message || 
                     'Failed to update account details'
    
    error.value = errorMsg
    showError(errorMsg)
  } finally {
    saving.value = false
    uploading.value = false
  }
}

const startEditing = () => {
  isEditing.value = true
  error.value = ''
  successMessage.value = ''
}

const cancelEditing = () => {
  isEditing.value = false
  error.value = ''
  successMessage.value = ''
  
  logoFile.value = null
  videoFile.value = null
  logoPreview.value = ''
  videoPreview.value = ''
  
  if (profile.value) {
    formData.value = {
      full_name: profile.value.user?.full_name || '',
      phone: profile.value.user?.phone || '',
      temple_name: profile.value.temple_name || '',
      temple_place: profile.value.temple_place || '',
      temple_address: profile.value.temple_address || '',
      temple_phone_no: profile.value.temple_phone_no || '',
      temple_description: profile.value.temple_description || '',
      logo_url: profile.value.logo_url || '',
      intro_video_url: profile.value.intro_video_url || '',
      // 🆕 Bank details
      account_holder_name: profile.value.bank?.account_holder_name || '',
      account_number: profile.value.bank?.account_number || '',
      bank_name: profile.value.bank?.bank_name || '',
      branch_name: profile.value.bank?.branch_name || '',
      ifsc_code: profile.value.bank?.ifsc_code || '',
      account_type: profile.value.bank?.account_type || '',
      upi_id: profile.value.bank?.upi_id || ''
    }
  }
}

// Lifecycle
onMounted(() => {
  console.log('🎬 TenantProfile component mounted')
  fetchProfile()
})
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>
