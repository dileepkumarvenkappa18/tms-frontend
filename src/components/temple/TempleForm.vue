<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200 rounded-2xl">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <a href="#" @click.prevent="goToDashboard" class="hover:text-indigo-600">Dashboard</a>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              <span class="text-gray-900">{{ isEditing ? 'Edit Temple' : 'Create Temple' }}</span>
            </nav>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Update Temple Information' : 'Register New Temple' }}
            </h1>
            <p class="text-gray-600 mt-1">
              {{ isEditing ? 'Update temple details and manage documents' : 'Fill out the form below to register your temple for approval' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Indicator -->
      <div class="mb-8" v-if="!isEditing">
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

      <!-- Error Display -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div class="ml-3">
            <p class="text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form @submit.prevent="handleSubmit">
          <!-- Step 1: Basic Information -->
          <div v-show="currentStep === 1 || isEditing" class="p-8">
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter temple name"
                />
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="e.g., Lord Vishnu, Goddess Lakshmi"
                />
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">Select temple type</option>
                  <option value="Vishnu Temple">Vishnu Temple</option>
                  <option value="Shiva Temple">Shiva Temple</option>
                  <option value="Devi Temple">Devi Temple</option>
                  <option value="Hanuman Temple">Hanuman Temple</option>
                  <option value="Ganesha Temple">Ganesha Temple</option>
                  <option value="Spiritual Center">Spiritual Center</option>
                  <option value="Other">Other</option>
                </select>
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="YYYY"
                />
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="+91 XXXXX XXXXX"
                />
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="temple@example.com"
                />
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Brief description of the temple, its history, and significance..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Step 2: Address Information -->
          <div v-show="currentStep === 2 || isEditing" class="p-8">
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter complete street address"
                />
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter city name"
                />
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">Select state</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Odisha">Odisha</option>
                </select>
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter district name"
                />
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter 6-digit PIN code"
                />
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
            </div>
          </div>

          <!-- Step 3: Documents Upload and View -->
          <div v-show="currentStep === 3 || isEditing" class="p-8">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-2">Upload & Manage Documents</h2>
              <p class="text-gray-600">Upload required documents for temple verification and view existing files</p>
            </div>

            <!-- Existing Documents View (for editing mode) -->
            <div v-if="isEditing && existingDocuments.length > 0" class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Documents</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="(doc, index) in existingDocuments"
                  :key="doc.id || index"
                  class="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center mb-2">
                        <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <span class="text-sm font-medium text-gray-900">{{ doc.type || 'Document' }}</span>
                      </div>
                      <p class="text-sm text-gray-600 mb-2">{{ doc.name || doc.filename }}</p>
                      <p class="text-xs text-gray-500">
                        Size: {{ formatFileSize(doc.size) }} | 
                        Uploaded: {{ formatDate(doc.uploadedAt || doc.created_at) }}
                      </p>
                    </div>
                  </div>
                  <div class="flex space-x-2 mt-3">
                    <button
                      type="button"
                      @click="viewDocument(doc)"
                      class="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      @click="downloadDocument(doc)"
                      class="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      @click="deleteDocument(doc, index)"
                      class="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- File Upload Section -->
            <div class="space-y-6">
              <!-- File Upload Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Registration Certificate -->
                <div class="space-y-2">
                  <label for="registration" class="block text-sm font-medium text-gray-700">
                    Registration Certificate *
                  </label>
                  <input
                    id="registration"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    @change="handleFileUpload($event, 'registration')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  <div v-if="form.documents.registration" class="flex items-center text-sm text-green-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ form.documents.registration.name }} ({{ formatFileSize(form.documents.registration.size) }})
                  </div>
                </div>

                <!-- Trust Deed -->
                <div class="space-y-2">
                  <label for="trustDeed" class="block text-sm font-medium text-gray-700">
                    Trust Deed *
                  </label>
                  <input
                    id="trustDeed"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    @change="handleFileUpload($event, 'trustDeed')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  <div v-if="form.documents.trustDeed" class="flex items-center text-sm text-green-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ form.documents.trustDeed.name }} ({{ formatFileSize(form.documents.trustDeed.size) }})
                  </div>
                </div>

                <!-- Property Documents -->
                <div class="space-y-2">
                  <label for="property" class="block text-sm font-medium text-gray-700">
                    Property Documents (Optional)
                  </label>
                  <input
                    id="property"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    @change="handleFileUpload($event, 'property')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  <div v-if="form.documents.property" class="flex items-center text-sm text-green-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ form.documents.property.name }} ({{ formatFileSize(form.documents.property.size) }})
                  </div>
                </div>

                <!-- Additional Documents -->
                <div class="space-y-2">
                  <label for="additional" class="block text-sm font-medium text-gray-700">
                    Additional Documents (Optional)
                  </label>
                  <input
                    id="additional"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    @change="handleFileUpload($event, 'additional')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  <div v-if="form.documents.additional && form.documents.additional.length > 0" class="space-y-1">
                    <div v-for="(file, index) in form.documents.additional" :key="index" class="flex items-center text-sm text-green-600">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      {{ file.name }} ({{ formatFileSize(file.size) }})
                    </div>
                  </div>
                </div>

              </div>

              <!-- File size and type information -->
              <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-800">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Accepted formats: PDF, JPG, PNG • Maximum size: 10MB per file
                </p>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div v-if="!isEditing" class="mt-8 p-4 bg-gray-50 rounded-lg">
              <label class="flex items-start">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="mt-1 mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  required
                />
                <span class="text-sm text-gray-700">
                  I agree to the Terms and Conditions and Privacy Policy.
                  I confirm that all information provided is accurate and complete.
                </span>
              </label>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              v-if="currentStep > 1 && !isEditing"
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
              <button
                type="button"
                @click="goToDashboard"
                class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>

              <button
                v-if="currentStep < 3 && !isEditing"
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
                {{ isSubmitting ? 'Submitting...' : (isEditing ? 'Update Temple' : 'Submit Temple Registration') }}
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
              If you need assistance with temple registration or file management, please contact our support team at 
              <a href="mailto:support@templesaas.com" class="underline">support@templesaas.com</a> 
              or call us at <a href="tel:+91-800-123-4567" class="underline">+91-800-123-4567</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Viewer Modal -->
    <div v-if="showDocumentViewer" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeDocumentViewer"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Document Viewer - {{ currentDocument?.name }}
              </h3>
              <button @click="closeDocumentViewer" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="max-h-96 overflow-auto">
              <div v-if="currentDocument?.type === 'pdf'" class="text-center p-8">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-gray-600 mb-4">PDF Preview not available. Click download to view the document.</p>
                <button @click="downloadDocument(currentDocument)" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Download PDF
                </button>
              </div>
              <img v-else-if="currentDocument?.preview" :src="currentDocument.preview" alt="Document preview" class="w-full h-auto" />
              <div v-else class="text-center p-8">
                <p class="text-gray-600">Preview not available for this document type.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  temple: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create' // 'create' or 'edit'
  }
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// Reactive state
const currentStep = ref(1)
const isSubmitting = ref(false)
const error = ref(null)
const showDocumentViewer = ref(false)
const currentDocument = ref(null)
const existingDocuments = ref([])

// Computed
const isEditing = computed(() => props.mode === 'edit' || !!props.temple)

// Form data with snake_case field names to match backend
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
  documents: {
    registration: null,
    trustDeed: null,
    property: null,
    additional: []
  },
  acceptTerms: false
})

// Methods
const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++
  }
}

const previousStep = () => {
  currentStep.value--
}

const validateCurrentStep = () => {
  error.value = null
  
  if (currentStep.value === 1) {
    const requiredFields = ['name', 'main_deity', 'temple_type', 'phone', 'email', 'established_year']
    const missingFields = requiredFields.filter(field => !form[field])
    
    if (missingFields.length > 0) {
      error.value = `Please fill in all required fields: ${missingFields.join(', ')}`
      return false
    }
    
    if (form.established_year && isNaN(parseInt(form.established_year))) {
      error.value = 'Established Year must be a valid number'
      return false
    }
    
    if (form.phone && !/^[0-9+\-\s()]{10,15}$/.test(form.phone)) {
      error.value = 'Please enter a valid phone number'
      return false
    }
    
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      error.value = 'Please enter a valid email address'
      return false
    }
  } else if (currentStep.value === 2) {
    const requiredFields = ['street_address', 'city', 'state', 'district', 'pincode']
    const missingFields = requiredFields.filter(field => !form[field])
    
    if (missingFields.length > 0) {
      error.value = `Please fill in all required address fields: ${missingFields.join(', ')}`
      return false
    }
    
    if (!form.street_address || form.street_address.trim() === '') {
      error.value = 'Street address is required'
      return false
    }
    
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      error.value = 'PIN Code must be a 6-digit number'
      return false
    }
  } else if (currentStep.value === 3 && !isEditing.value) {
    if (!form.documents.registration) {
      error.value = 'Registration certificate is required'
      return false
    }
    
    if (!form.documents.trustDeed) {
      error.value = 'Trust deed is required'
      return false
    }
    
    if (!form.acceptTerms) {
      error.value = 'Please accept the terms and conditions'
      return false
    }
  }
  
  return true
}

const handleFileUpload = (event, type) => {
  const files = Array.from(event.target.files)
  console.log("handleFileUpload:",handleFileUpload)
  
  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024
  const invalidFiles = files.filter(file => file.size > maxSize)
  
  if (invalidFiles.length > 0) {
    error.value = 'Some files exceed the 10MB size limit'
    return
  }
  
  if (type === 'additional') {
    form.documents.additional = [...form.documents.additional, ...files]
  } else {
    form.documents[type] = files[0]
    console.log('type=',type)
  }
  
  error.value = null
}

const removeFile = (type) => {
  form.documents[type] = null
}

const removeAdditionalFile = (index) => {
  form.documents.additional.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}

const viewDocument = (document) => {
  currentDocument.value = document
  
  // For images, create a preview URL
  if (document.file && document.file.type.startsWith('image/')) {
    document.preview = URL.createObjectURL(document.file)
  }
  
  showDocumentViewer.value = true
}

const closeDocumentViewer = () => {
  showDocumentViewer.value = false
  if (currentDocument.value?.preview) {
    URL.revokeObjectURL(currentDocument.value.preview)
  }
  currentDocument.value = null
}

const downloadDocument = async (document) => {
  try {
    // In a real application, this would make an API call to download the file
    const link = document.createElement('a')
    
    if (document.file) {
      // For new uploads
      link.href = URL.createObjectURL(document.file)
      link.download = document.name || document.file.name
    } else if (document.url) {
      // For existing documents
      link.href = document.url
      link.download = document.name
    }
    
    link.click()
    
    // Clean up the object URL
    if (document.file) {
      setTimeout(() => URL.revokeObjectURL(link.href), 100)
    }
  } catch (err) {
    error.value = 'Failed to download document'
  }
}

const deleteDocument = async (document, index) => {
  if (confirm('Are you sure you want to delete this document?')) {
    try {
      // In a real application, this would make an API call to delete the file
      existingDocuments.value.splice(index, 1)
      showToast('Document deleted successfully', 'success')
    } catch (err) {
      error.value = 'Failed to delete document'
    }
  }
}

const showToast = (message, type = 'info') => {
  // Simple toast implementation
  console.log(`${type.toUpperCase()}: ${message}`)
}

const goToDashboard = () => {
  emit('cancel')
}

const handleSubmit = async () => {
  if (!validateCurrentStep()) return

  try {
    isSubmitting.value = true
    error.value = null

    console.log('🔍 FORM DATA AT SUBMISSION:')
    console.log('Street address value:', form.street_address)
    console.log('Main deity value:', form.main_deity)
    console.log('Temple type value:', form.temple_type)

    // Create FormData for file upload
    const formData = new FormData()
    
    // Add basic form fields
    const payload = {
      name: form.name || "",
      main_deity: form.main_deity || "",
      temple_type: form.temple_type || "",
      established_year: parseInt(form.established_year || 0),
      phone: form.phone ? form.phone.replace(/[^0-9]/g, '') : "",
      email: form.email || "",
      description: form.description || '',
      street_address: form.street_address || '',
      city: form.city || "",
      district: form.district || "",
      state: form.state || "",
      pincode: form.pincode || "",
      landmark: form.landmark || '',
      accepted_terms: true,
      status: 'pending'
     
    }

    // Add each field to FormData
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key])
      }
    })

    // Add documents
    if (form.documents.registration) {
      formData.append('registration', form.documents.registration)
    }
    if (form.documents.trustDeed) {
      formData.append('trustDeed', form.documents.trustDeed)
    }
    if (form.documents.property) {
      formData.append('property', form.documents.property)
    }
    
    // Add additional documents
    form.documents.additional.forEach((file, index) => {
      formData.append(`additional_${index}`, file)
    })

    console.log('📦 FormData prepared with files and data')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In real implementation, make API call:
    // const response = await axios.post('/api/temples', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // })

    console.log('✅ Temple registration submitted successfully')
    emit('submit', { success: true, message: 'Temple registered successfully!' })
    
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to submit temple registration. Please try again.'
    console.error('Temple registration failed:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Initialize form with temple data if editing
onMounted(() => {
  if (props.temple) {
    Object.keys(form).forEach(key => {
      if (key !== 'documents' && key !== 'acceptTerms') {
        form[key] = props.temple[key] || ''
      }
    })
    
    // Load existing documents
    if (props.temple.documents) {
      existingDocuments.value = props.temple.documents || []
    }
  }
})
</script>

<style scoped>
/* Custom styles for enhanced UX */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* File upload hover effects */
.border-dashed:hover {
  border-color: rgb(99 102 241);
  background-color: rgb(249 250 251);
}

/* Form input focus styles */
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgb(99 102 241);
  border-color: rgb(99 102 241);
}

/* Modal backdrop blur effect */
.fixed.inset-0 {
  backdrop-filter: blur(4px);
}

/* Custom scrollbar for document viewer */
.max-h-96::-webkit-scrollbar {
  width: 8px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>