<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200 rounded-2xl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <router-link to="/tenant/dashboard" class="hover:text-indigo-600">Dashboard</router-link>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span class="text-gray-900">Create Temple</span>
            </nav>
            <h1 class="text-2xl font-bold text-gray-900">Register New Temple</h1>
            <p class="text-gray-600 mt-1">Fill out the form below to register your temple for approval</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-red-800 mb-1">Registration Failed</h3>
            <p class="text-sm text-red-700">{{ error }}</p>
            <ul v-if="validationErrors.length > 0" class="mt-2 text-sm text-red-700">
              <li v-for="(err, index) in validationErrors" :key="index" class="flex items-center">
                <span class="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                {{ err }}
              </li>
            </ul>
          </div>
          <button @click="clearError" class="ml-auto">
            <svg class="w-4 h-4 text-red-400 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-indigo-600">Step {{ currentStep }} of 3</span>
          <span class="text-sm text-gray-500">{{ Math.round((currentStep / 3) * 100) }}% Complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / 3) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form @submit.prevent="handleSubmit">
          <!-- Step 1: Basic Information -->
          <div v-show="currentStep === 1" class="p-8">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-2">Temple Basic Information</h2>
              <p class="text-gray-600">Provide the essential details about your temple</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Temple Name -->
              <div class="md:col-span-2">
                <label for="templeName" class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Name *
                </label>
                <input
                  id="templeName"
                  v-model="form.name"
                  type="text"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="Enter temple name"
                  @input="clearFieldError('name')"
                />
                <p v-if="fieldErrors.name" class="mt-1 text-sm text-red-600">{{ fieldErrors.name }}</p>
              </div>

              <!-- Deity -->
              <div>
                <label for="deity" class="block text-sm font-medium text-gray-700 mb-2">
                  Main Deity *
                </label>
                <input
                  id="deity"
                  v-model="form.main_deity"
                  type="text"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.main_deity ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="e.g., Lord Vishnu, Goddess Lakshmi"
                  @input="clearFieldError('main_deity')"
                />
                <p v-if="fieldErrors.main_deity" class="mt-1 text-sm text-red-600">{{ fieldErrors.main_deity }}</p>
              </div>

              <!-- Temple Type -->
              <div>
                <label for="templeType" class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Type *
                </label>
                <select
                  id="templeType"
                  v-model="form.temple_type"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.temple_type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  @change="clearFieldError('temple_type')"
                >
                  <option value="">Select temple type</option>
                  <option value="traditional">Traditional</option>
                  <option value="modern">Modern</option>
                  <option value="heritage">Heritage</option>
                  <option value="community">Community</option>
                </select>
                <p v-if="fieldErrors.temple_type" class="mt-1 text-sm text-red-600">{{ fieldErrors.temple_type }}</p>
              </div>

              <!-- Established Year -->
              <div>
                <label for="establishedYear" class="block text-sm font-medium text-gray-700 mb-2">
                  Established Year *
                </label>
                <input
                  id="establishedYear"
                  v-model="form.established_year"
                  type="number"
                  min="1800"
                  :max="new Date().getFullYear()"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.established_year ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="YYYY"
                  @input="clearFieldError('established_year')"
                />
                <p v-if="fieldErrors.established_year" class="mt-1 text-sm text-red-600">{{ fieldErrors.established_year }}</p>
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="+91 XXXXX XXXXX"
                  @input="clearFieldError('phone')"
                />
                <p v-if="fieldErrors.phone" class="mt-1 text-sm text-red-600">{{ fieldErrors.phone }}</p>
              </div>

              <!-- Email -->
              <div class="md:col-span-2">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Email *
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="temple@example.com"
                  @input="clearFieldError('email')"
                />
                <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-600">{{ fieldErrors.email }}</p>
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Temple Description
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="4"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="Brief description of the temple, its history, and significance..."
                  @input="clearFieldError('description')"
                ></textarea>
                <p v-if="fieldErrors.description" class="mt-1 text-sm text-red-600">{{ fieldErrors.description }}</p>
              </div>
            </div>
          </div>

          <!-- Step 2: Address Information -->
          <div v-show="currentStep === 2" class="p-8">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-2">Temple Address</h2>
              <p class="text-gray-600">Provide the complete address details</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Street Address -->
              <div class="md:col-span-2">
                <label for="street_address" class="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  id="street_address"
                  v-model="form.street_address"
                  type="text"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.street_address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="Enter complete street address"
                  @input="clearFieldError('street_address')"
                />
                <p v-if="fieldErrors.street_address" class="mt-1 text-sm text-red-600">{{ fieldErrors.street_address }}</p>
              </div>

              <!-- City -->
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  id="city"
                  v-model="form.city"
                  type="text"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="Enter city name"
                  @input="clearFieldError('city')"
                />
                <p v-if="fieldErrors.city" class="mt-1 text-sm text-red-600">{{ fieldErrors.city }}</p>
              </div>

              <!-- State -->
              <div>
                <label for="state" class="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  id="state"
                  v-model="form.state"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  @change="clearFieldError('state')"
                >
                  <option value="">Select state</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Odisha">Odisha</option>
                </select>
                <p v-if="fieldErrors.state" class="mt-1 text-sm text-red-600">{{ fieldErrors.state }}</p>
              </div>

              <!-- District -->
              <div>
                <label for="district" class="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  id="district"
                  v-model="form.district"
                  type="text"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.district ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="Enter district name"
                  @input="clearFieldError('district')"
                />
                <p v-if="fieldErrors.district" class="mt-1 text-sm text-red-600">{{ fieldErrors.district }}</p>
              </div>

              <!-- PIN Code -->
              <div>
                <label for="pincode" class="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code *
                </label>
                <input
                  id="pincode"
                  v-model="form.pincode"
                  type="text"
                  pattern="[0-9]{6}"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.pincode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="Enter 6-digit PIN code"
                  @input="clearFieldError('pincode')"
                />
                <p v-if="fieldErrors.pincode" class="mt-1 text-sm text-red-600">{{ fieldErrors.pincode }}</p>
              </div>

              <!-- Landmark -->
              <div class="md:col-span-2">
                <label for="landmark" class="block text-sm font-medium text-gray-700 mb-2">
                  Landmark (Optional)
                </label>
                <input
                  id="landmark"
                  v-model="form.landmark"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Nearby landmark for easy identification"
                />
              </div>

              <!-- Google Maps Link -->
              <div class="md:col-span-2">
                <label for="map_link" class="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps Link (Optional)
                </label>
                <input
                  id="map_link"
                  v-model="form.map_link"
                  type="url"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200',
                    fieldErrors.map_link ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="https://maps.google.com/..."
                  @input="clearFieldError('map_link')"
                />
                <p v-if="fieldErrors.map_link" class="mt-1 text-sm text-red-600">{{ fieldErrors.map_link }}</p>
              </div>
            </div>
          </div>

          <!-- Step 3: Documents Upload -->
          <div v-show="currentStep === 3" class="p-8">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-2">Upload Documents</h2>
              <p class="text-gray-600">Upload required documents for temple verification</p>
            </div>

            <div class="space-y-6">
              <!-- Registration Certificate -->
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors duration-200">
                <div class="text-center">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Registration Certificate *</h3>
                  <p class="text-gray-600 mb-4">Upload temple registration certificate</p>
                  <div class="flex justify-center">
                    <label class="cursor-pointer bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                      <span>Choose File</span>
                      <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" @change="handleFileUpload($event, 'registration')" />
                    </label>
                  </div>
                  <p v-if="form.documents.registration" class="text-sm text-green-600 mt-2">
                    ✓ {{ form.documents.registration.name }}
                  </p>
                  <p v-if="fieldErrors.registration" class="text-sm text-red-600 mt-2">{{ fieldErrors.registration }}</p>
                </div>
              </div>

              <!-- Trust Deed -->
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors duration-200">
                <div class="text-center">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Trust Deed *</h3>
                  <p class="text-gray-600 mb-4">Upload temple trust deed document</p>
                  <div class="flex justify-center">
                    <label class="cursor-pointer bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                      <span>Choose File</span>
                      <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" @change="handleFileUpload($event, 'trustDeed')" />
                    </label>
                  </div>
                  <p v-if="form.documents.trustDeed" class="text-sm text-green-600 mt-2">
                    ✓ {{ form.documents.trustDeed.name }}
                  </p>
                  <p v-if="fieldErrors.trustDeed" class="text-sm text-red-600 mt-2">{{ fieldErrors.trustDeed }}</p>
                </div>
              </div>

              <!-- Property Documents -->
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors duration-200">
                <div class="text-center">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Property Documents</h3>
                  <p class="text-gray-600 mb-4">Upload property ownership documents (Optional)</p>
                  <div class="flex justify-center">
                    <label class="cursor-pointer bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                      <span>Choose File</span>
                      <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" @change="handleFileUpload($event, 'property')" />
                    </label>
                  </div>
                  <p v-if="form.documents.property" class="text-sm text-green-600 mt-2">
                    ✓ {{ form.documents.property.name }}
                  </p>
                </div>
              </div>

              <!-- Additional Documents -->
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors duration-200">
                <div class="text-center">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Additional Documents</h3>
                  <p class="text-gray-600 mb-4">Upload any additional supporting documents (Optional)</p>
                  <div class="flex justify-center">
                    <label class="cursor-pointer bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                      <span>Choose Files</span>
                      <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple @change="handleFileUpload($event, 'additional')" />
                    </label>
                  </div>
                  <div v-if="form.documents.additional && form.documents.additional.length > 0" class="mt-2">
                    <p v-for="(file, index) in form.documents.additional" :key="index" class="text-sm text-green-600">
                      ✓ {{ file.name }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="mt-8 p-4 bg-gray-50 rounded-lg">
              <label class="flex items-start">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  :class="[
                    'mt-1 mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded',
                    fieldErrors.acceptTerms ? 'border-red-300' : ''
                  ]"
                  required
                  @change="clearFieldError('acceptTerms')"
                />
                <span class="text-sm text-gray-700">
                  I agree to the 
                  <router-link to="/terms" class="text-indigo-600 hover:text-indigo-800 underline">Terms and Conditions</router-link>
                  and 
                  <router-link to="/privacy" class="text-indigo-600 hover:text-indigo-800 underline">Privacy Policy</router-link>.
                  I confirm that all information provided is accurate and complete.
                </span>
              </label>
              <p v-if="fieldErrors.acceptTerms" class="mt-1 text-sm text-red-600">{{ fieldErrors.acceptTerms }}</p>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="previousStep"
              class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Previous
            </button>
            <div v-else></div>

            <div class="flex space-x-3">
              <router-link
                to="/tenant/dashboard"
                class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </router-link>

              <button
                v-if="currentStep < 3"
                type="button"
                @click="nextStep"
                class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                Next
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <button
                v-else
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Submitting...' : 'Submit Temple Registration' }}
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Help Section -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-blue-800 mb-1">Need Help?</h3>
            <p class="text-sm text-blue-700">
              If you need assistance with temple registration, please contact our support team at 
              <a href="mailto:support@templesaas.com" class="underline">support@templesaas.com</a> 
              or call us at <a href="tel:+91-800-123-4567" class="underline">+91-800-123-4567</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTempleStore } from '@/stores/temple'
import { useToast } from '@/composables/useToast'
import { validators } from '@/utils/validators'
import api from '@/plugins/axios'

const router = useRouter()
const templeStore = useTempleStore()
const toast = useToast()

// Form state
const currentStep = ref(1)
const isSubmitting = ref(false)
const error = ref(null)
const validationErrors = ref([])
const fieldErrors = reactive({})

// Form data with snake_case field names to EXACTLY match backend
const form = reactive({
  name: '',
  main_deity: '',
  temple_type: '',
  established_year: '',
  phone: '',
  email: '',
  description: '',
  street_address: '',
  city: '',
  state: '',
  district: '',
  pincode: '',
  landmark: '',
  map_link: '',
  documents: {
    registration: null,
    trustDeed: null,
    property: null,
    additional: []
  },
  acceptTerms: false
})

// Field validation rules
const validationRules = {
  step1: {
    name: { required: true, minLength: 2, maxLength: 100 },
    main_deity: { required: true, minLength: 2, maxLength: 50 },
    temple_type: { required: true },
    established_year: { required: true, min: 1800, max: new Date().getFullYear() },
    phone: { required: true, pattern: /^[0-9+\-\s()]{10,15}$/ },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  },
  step2: {
    street_address: { required: true, minLength: 5, maxLength: 200 },
    city: { required: true, minLength: 2, maxLength: 50 },
    state: { required: true },
    district: { required: true, minLength: 2, maxLength: 50 },
    pincode: { required: true, pattern: /^\d{6}$/ }
  },
  step3: {
    acceptTerms: { required: true },
    registration: { required: true },
    trustDeed: { required: true }
  }
}

// Error handling methods
const clearError = () => {
  error.value = null
  validationErrors.value = []
}

const clearFieldError = (fieldName) => {
  if (fieldErrors[fieldName]) {
    delete fieldErrors[fieldName]
  }
}

const clearAllFieldErrors = () => {
  Object.keys(fieldErrors).forEach(key => {
    delete fieldErrors[key]
  })
}

const setFieldError = (fieldName, message) => {
  fieldErrors[fieldName] = message
}

const validateField = (fieldName, value, rules) => {
  clearFieldError(fieldName)
  
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    setFieldError(fieldName, `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`)
    return false
  }
  
  if (value && rules.minLength && value.length < rules.minLength) {
    setFieldError(fieldName, `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must be at least ${rules.minLength} characters`)
    return false
  }
  
  if (value && rules.maxLength && value.length > rules.maxLength) {
    setFieldError(fieldName, `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must not exceed ${rules.maxLength} characters`)
    return false
  }
  
  if (value && rules.min && parseInt(value) < rules.min) {
    setFieldError(fieldName, `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must be at least ${rules.min}`)
    return false
  }
  
  if (value && rules.max && parseInt(value) > rules.max) {
    setFieldError(fieldName, `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must not exceed ${rules.max}`)
    return false
  }
  
  if (value && rules.pattern && !rules.pattern.test(value)) {
    let message = `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} format is invalid`
    if (fieldName === 'email') message = 'Please enter a valid email address'
    if (fieldName === 'phone') message = 'Please enter a valid phone number'
    if (fieldName === 'pincode') message = 'PIN code must be exactly 6 digits'
    setFieldError(fieldName, message)
    return false
  }
  
  return true
}

const validateStep = (step) => {
  clearAllFieldErrors()
  let isValid = true
  let stepRules = {}
  
  switch (step) {
    case 1:
      stepRules = validationRules.step1
      break
    case 2:
      stepRules = validationRules.step2
      break
    case 3:
      stepRules = validationRules.step3
      break
  }
  
  // Validate regular fields
  Object.keys(stepRules).forEach(fieldName => {
    if (fieldName === 'registration' || fieldName === 'trustDeed' || fieldName === 'acceptTerms') return
    
    const fieldValue = form[fieldName]
    const fieldRules = stepRules[fieldName]
    
    if (!validateField(fieldName, fieldValue, fieldRules)) {
      isValid = false
    }
  })
  
  // Special validation for step 3
  if (step === 3) {
    if (!form.documents.registration) {
      setFieldError('registration', 'Registration certificate is required')
      isValid = false
    }
    
    if (!form.documents.trustDeed) {
      setFieldError('trustDeed', 'Trust deed document is required')
      isValid = false
    }
    
    if (!form.acceptTerms) {
      setFieldError('acceptTerms', 'You must accept the terms and conditions')
      isValid = false
    }
  }
  
  return isValid
}

// Methods
const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
    clearError()
  } else {
    error.value = 'Please fix the errors below before proceeding'
    // Scroll to top to show error
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousStep = () => {
  currentStep.value--
  clearError()
  clearAllFieldErrors()
}

const validateCurrentStep = () => {
  return validateStep(currentStep.value)
}

const handleFileUpload = (event, type) => {
  const files = Array.from(event.target.files)
  
  if (!files.length) return
  
  // Clear any existing file errors for this type
  clearFieldError(type)
  
  // Validate file size (max 5MB per file)
  const maxSize = 5 * 1024 * 1024 // 5MB
  for (const file of files) {
    if (file.size > maxSize) {
      setFieldError(type, `File ${file.name} is too large. Maximum size is 5MB.`)
      return
    }
  }
  
  // Validate file types
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      setFieldError(type, `File ${file.name} is not a supported format. Please use PDF, JPG, or PNG.`)
      return
    }
  }
  
  if (type === 'additional') {
    form.documents.additional = files
  } else {
    form.documents[type] = files[0]
  }
}

const parseServerErrors = (errorData) => {
  validationErrors.value = []
  
  if (errorData.errors && Array.isArray(errorData.errors)) {
    // Handle array of error objects
    errorData.errors.forEach(err => {
      if (err.field && err.message) {
        setFieldError(err.field, err.message)
        validationErrors.value.push(`${err.field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${err.message}`)
      } else if (typeof err === 'string') {
        validationErrors.value.push(err)
      }
    })
  } else if (errorData.errors && typeof errorData.errors === 'object') {
    // Handle object with field keys
    Object.keys(errorData.errors).forEach(field => {
      const fieldError = errorData.errors[field]
      const message = Array.isArray(fieldError) ? fieldError[0] : fieldError
      setFieldError(field, message)
      validationErrors.value.push(`${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${message}`)
    })
  } else if (errorData.message) {
    validationErrors.value.push(errorData.message)
  } else if (typeof errorData === 'string') {
    validationErrors.value.push(errorData)
  }
}

const handleSubmit = async () => {
  if (!validateCurrentStep()) {
    error.value = 'Please fix the errors below before submitting'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  try {
    isSubmitting.value = true
    clearError()
    clearAllFieldErrors()

    console.log('🔍 FORM DATA AT SUBMISSION:')
    console.log('Street address value:', form.street_address)
    console.log('Main deity value:', form.main_deity)
    console.log('Temple type value:', form.temple_type)

    // Create the exact payload that matches the backend fields
    const payload = {
      name: form.name?.trim() || "",
      main_deity: form.main_deity?.trim() || "",
      temple_type: form.temple_type || "",
      established_year: parseInt(form.established_year) || 0,
      phone: form.phone ? form.phone.replace(/[^0-9]/g, '') : "",
      email: form.email?.trim() || "",
      description: form.description?.trim() || '',
      street_address: form.street_address?.trim() || '',
      city: form.city?.trim() || "",
      district: form.district?.trim() || "",
      state: form.state || "",
      pincode: form.pincode?.trim() || "",
      landmark: form.landmark?.trim() || '',
      map_link: form.map_link?.trim() || '',
      accepted_terms: form.acceptTerms,
      status: 'pending'
    }

    console.log('📦 Final payload being sent:', payload)

    // Validate payload one more time before sending
    const requiredFields = ['name', 'main_deity', 'temple_type', 'phone', 'email', 'street_address', 'city', 'state', 'district', 'pincode']
    const missingFields = requiredFields.filter(field => !payload[field])
    
    if (missingFields.length > 0) {
      error.value = `Missing required fields: ${missingFields.join(', ')}`
      missingFields.forEach(field => {
        setFieldError(field, 'This field is required')
      })
      return
    }

    // Make a direct API call to create the temple
    const response = await api.post('/v1/entities', payload)
    
    console.log('✅ Temple created successfully:', response.data)

    toast.success('Temple registration submitted successfully!')
    router.push('/tenant/dashboard')
  } catch (err) {
    console.error('Temple registration failed:', err)
    
    if (err.response?.data) {
      console.error('Error response data:', err.response.data)
      parseServerErrors(err.response.data)
      error.value = err.response.data.message || 'Temple registration failed. Please check the errors below and try again.'
    } else if (err.response?.status) {
      switch (err.response.status) {
        case 400:
          error.value = 'Invalid data provided. Please check your inputs and try again.'
          break
        case 401:
          error.value = 'You are not authorized to perform this action. Please login again.'
          break
        case 403:
          error.value = 'You do not have permission to register temples.'
          break
        case 422:
          error.value = 'Validation failed. Please check the highlighted fields.'
          break
        case 500:
          error.value = 'Server error occurred. Please try again later or contact support.'
          break
        default:
          error.value = `Registration failed with error ${err.response.status}. Please try again.`
      }
    } else if (err.message) {
      error.value = `Network error: ${err.message}`
    } else {
      error.value = 'An unexpected error occurred. Please try again.'
    }
    
    // Scroll to top to show error
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isSubmitting.value = false
  }
}
</script>