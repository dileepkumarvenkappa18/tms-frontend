<!-- src/views/devotee/DonationHistory.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
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
              <h1 class="text-lg font-semibold text-gray-900">
                {{ currentTemple.name || 'Loading Temple...' }}
              </h1>
              <p class="text-sm text-gray-500" v-if="currentTemple.city || currentTemple.state">
                {{ currentTemple.city }}{{ currentTemple.city && currentTemple.state ? ', ' : '' }}{{ currentTemple.state }}
              </p>
              <div class="flex items-center gap-3 mt-1">
                <div v-if="currentTemple.createdBy" class="flex items-center gap-2">
                  <p class="text-xs text-gray-400">
                    Created by: 
                    <span v-if="creatorDetails.loading" class="text-gray-400">Loading...</span>
                    <span v-else-if="creatorDetails.fullName" class="text-indigo-600 font-medium">
                      {{ creatorDetails.fullName }}
                    </span>
                    <span v-else class="text-gray-400">User ID: {{ currentTemple.createdBy }}</span>
                  </p>
                  <span v-if="creatorDetails.roleName" 
                    class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {{ creatorDetails.roleName }}
                  </span>
                </div>
                <span v-if="currentTemple.status" 
                  :class="{
                    'bg-green-100 text-green-800': currentTemple.status === 'approved',
                    'bg-yellow-100 text-yellow-800': currentTemple.status === 'pending',
                    'bg-red-100 text-red-800': currentTemple.status === 'rejected'
                  }"
                  class="px-2 py-0.5 text-xs font-medium rounded-full">
                  {{ currentTemple.status }}
                </span>
              </div>
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
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">My Donations</h2>
              <p class="mt-1 text-sm text-gray-600">Track your donation history and receipts</p>
            </div>
            <button 
              @click="showDonationForm = true"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-indigo-100 rounded-lg">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Donated</p>
              <p class="text-2xl font-bold text-gray-900">₹{{ totalDonated.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Donations</p>
              <p class="text-2xl font-bold text-gray-900">{{ donationHistory.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-amber-100 rounded-lg">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0v-4m4-8a4 4 0 118 0v4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-gray-900">₹{{ thisMonthDonated.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select 
              v-model="filters.dateRange" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
            <select 
              v-model="filters.donationType" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="general">General Donation</option>
              <option value="seva">Seva Donation</option>
              <option value="festival">Festival Donation</option>
              <option value="construction">Construction Fund</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
            <select 
              v-model="filters.amountRange" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Amounts</option>
              <option value="0-500">₹0 - ₹500</option>
              <option value="501-1000">₹501 - ₹1,000</option>
              <option value="1001-5000">₹1,001 - ₹5,000</option>
              <option value="5000+">₹5,000+</option>
            </select>
          </div>

          <div class="flex items-end">
            <button 
              @click="resetFilters"
              class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Donation History Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Donation History</h3>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="donation in filteredDonations" :key="donation.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(donation.date || donation.created_at || donation.donated_at || donation.donatedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getDonationTypeClass(donation.type || donation.donationType)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ (donation.type || donation.donationType || 'N/A').toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₹{{ Number(donation.amount || 0).toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getPaymentMethodClass(donation.method || donation.paymentMethod)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getPaymentMethodLabel(donation.method || donation.paymentMethod) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(donation.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ (donation.status || 'N/A').toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    @click="viewDonationDetails(donation)"
                    class="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing page {{ pagination.page }} of {{ pagination.totalPages }} ({{ pagination.total }} total donations)
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              :class="[
                'px-3 py-1 rounded border',
                pagination.page === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              Previous
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              :class="[
                'px-3 py-1 rounded border',
                pagination.page >= pagination.totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredDonations.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No donations found</h3>
          <p class="mt-1 text-sm text-gray-500">No donations match your current filters.</p>
        </div>
      </div>
    </div>

    <!-- Donation Details Modal -->
    <div v-if="selectedDonation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Donation Details</h3>
          <button @click="selectedDonation = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- From Details (Donor Information) -->
          <div class="space-y-4">
            <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                From (Donor)
              </h4>
              <div class="space-y-2">
                <div>
                  <p class="text-xs text-blue-700">Name</p>
                  <p class="font-semibold text-blue-900">{{ selectedDonation.donorName || selectedDonation.userName || currentUser.name || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-blue-700">Email</p>
                  <p class="text-sm text-blue-900">{{ selectedDonation.donorEmail || selectedDonation.userEmail || currentUser.email || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- To Details (Temple/Recipient Information) -->
          <!-- To Details (ACTUAL RECIPIENT Information) -->
<div class="space-y-4">
  <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4">
    <h4 class="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      To (Actual Recipient)
    </h4>
    <div class="space-y-2">
      <div>
        <p class="text-xs text-green-700">Temple Name</p>
        <p class="font-semibold text-green-900">{{ selectedDonation.entityName || currentTemple.name || 'N/A' }}</p>
      </div>
      
      <!-- ✅ Show ACTUAL recipient from donation record -->
      <div v-if="selectedDonation.account_holder_name">
        <p class="text-xs text-green-700">Payment Received By</p>
        <p class="text-sm font-semibold text-green-900">{{ selectedDonation.account_holder_name }}</p>
      </div>
      
      <div v-if="selectedDonation.account_number">
        <p class="text-xs text-green-700">Account/UPI ID</p>
        <p class="text-sm font-mono text-green-900">{{ selectedDonation.account_number }}</p>
      </div>
      
      <div v-if="selectedDonation.upi_id">
        <p class="text-xs text-green-700">UPI ID</p>
        <p class="text-sm font-mono text-green-900">{{ selectedDonation.upi_id }}</p>
      </div>

      <!-- ℹ️ Show expected vs actual if different -->
      <div v-if="selectedDonation.account_holder_name && 
                 creatorDetails.bank && 
                 selectedDonation.account_holder_name !== creatorDetails.bank.account_holder_name"
           class="mt-3 pt-3 border-t border-yellow-300 bg-yellow-50 rounded p-2">
        <p class="text-xs font-semibold text-yellow-900">⚠️ Payment Routing Notice:</p>
        <p class="text-xs text-yellow-800">
          Payment was processed through {{ selectedDonation.account_holder_name }} 
          for {{ creatorDetails.bank.account_holder_name }}
        </p>
      </div>
    </div>
  </div>
</div>

          <!-- Payment Details - Shows based on payment method -->
          <div class="md:col-span-2">
            <!-- UPI Payment Details -->
            <div
v-if="['upi','online','netbanking','card','wallet'].includes(
  (selectedDonation.method || selectedDonation.paymentMethod || '').toLowerCase()
)"
                 class="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                UPI Payment Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-indigo-700">Payment ID</p>
                  <p class="text-sm font-mono text-indigo-900 break-all">{{ selectedDonation.paymentId || selectedDonation.payment_id || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-indigo-700">Transaction/Order ID</p>
                  <p class="text-sm font-mono text-indigo-900 break-all">{{ selectedDonation.transactionId || selectedDonation.transaction_id || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-indigo-700">Amount</p>
                  <p class="text-lg font-bold text-indigo-900">₹{{ Number(selectedDonation.amount || 0).toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <!-- Bank Transfer Details -->
            <div v-else-if="selectedDonation.method === 'bank' || selectedDonation.paymentMethod === 'bank'" 
                 class="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                </svg>
                Bank Transfer Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-green-700">Bank Name</p>
                  <p class="text-sm font-semibold text-green-900">{{ creatorDetails.bank?.bank_name || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-green-700">Account Holder</p>
                  <p class="text-sm font-semibold text-green-900">{{ creatorDetails.bank?.account_holder_name || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-green-700">Account Number</p>
                  <p class="text-sm font-mono font-semibold text-green-900">{{ creatorDetails.bank?.account_number || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-green-700">IFSC Code</p>
                  <p class="text-sm font-mono font-semibold text-green-900">{{ creatorDetails.bank?.ifsc_code || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-green-700">Branch</p>
                  <p class="text-sm text-green-900">{{ creatorDetails.bank?.branch_name || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-green-700">Amount Transferred</p>
                  <p class="text-lg font-bold text-green-900">₹{{ selectedDonation.amount.toLocaleString() }}</p>
                </div>
              </div>
              <div v-if="selectedDonation.bank_transaction_id || selectedDonation.bank_reference" class="mt-3 pt-3 border-t border-green-300">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="selectedDonation.bank_transaction_id">
                    <p class="text-xs text-green-700">Transaction ID</p>
                    <p class="text-sm font-mono text-green-900">{{ selectedDonation.bank_transaction_id }}</p>
                  </div>
                  <div v-if="selectedDonation.bank_reference">
                    <p class="text-xs text-green-700">Bank Reference</p>
                    <p class="text-sm font-mono text-green-900">{{ selectedDonation.bank_reference }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Generic Payment Details (fallback) -->
            <div v-else class="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                Payment Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-gray-700">Payment ID</p>
                  <p class="text-sm font-mono text-gray-900 break-all">{{ selectedDonation.payment_id || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-700">Order ID</p>
                  <p class="text-sm font-mono text-gray-900 break-all">{{ selectedDonation.order_id || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-700">Amount</p>
                  <p class="text-lg font-bold text-gray-900">₹{{ selectedDonation.amount.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Transaction Details -->
          <div class="md:col-span-2">
            <div class="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <h4 class="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Transaction Details
              </h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-xs text-amber-700">Type</p>
                  <span :class="getDonationTypeClass(selectedDonation.type || selectedDonation.donationType)" class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1">
                    {{ (selectedDonation.type || selectedDonation.donationType || 'N/A').toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-amber-700">Status</p>
                  <span :class="getStatusClass(selectedDonation.status)" class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1">
                    {{ (selectedDonation.status || 'N/A').toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-amber-700">Date</p>
                  <p class="text-sm text-amber-900">{{ formatDate(selectedDonation.date || selectedDonation.created_at || selectedDonation.donatedAt) }}</p>
                </div>
                <div>
                  <p class="text-xs text-amber-700">Time</p>
                  <p class="text-sm text-amber-900">{{ formatTime(selectedDonation.date || selectedDonation.created_at || selectedDonation.donatedAt) }}</p>
                </div>
              </div>
              <div v-if="selectedDonation.note" class="mt-3 pt-3 border-t border-amber-300">
                <p class="text-xs text-amber-700">Purpose/Note</p>
                <p class="text-sm text-amber-900">{{ selectedDonation.note }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-6 pt-6 border-t">
          <button 
            @click="selectedDonation = null"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Donation Form Modal -->
    <div v-if="showDonationForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Make a Donation</h3>
          <button @click="closeDonationForm" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Step 1: Payment Method Selection -->
        <div v-if="!donationForm.showBankDetails" class="space-y-4">
          <!-- Payment Method Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="donationForm.paymentMethod = 'online'"
                :class="[
                  'p-4 border-2 rounded-lg transition-all duration-200',
                  donationForm.paymentMethod === 'online' 
                    ? 'border-indigo-600 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-300'
                ]"
              >
                <svg class="w-8 h-8 mx-auto mb-2" :class="donationForm.paymentMethod === 'online' ? 'text-indigo-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <p :class="['text-sm font-medium', donationForm.paymentMethod === 'online' ? 'text-indigo-900' : 'text-gray-700']">
                  UPI / Online
                </p>
              </button>
              
              <button
                type="button"
                @click="donationForm.paymentMethod = 'bank'"
                :class="[
                  'p-4 border-2 rounded-lg transition-all duration-200',
                  donationForm.paymentMethod === 'bank' 
                    ? 'border-green-600 bg-green-50' 
                    : 'border-gray-300 hover:border-green-300'
                ]"
              >
                <svg class="w-8 h-8 mx-auto mb-2" :class="donationForm.paymentMethod === 'bank' ? 'text-green-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                </svg>
                <p :class="['text-sm font-medium', donationForm.paymentMethod === 'bank' ? 'text-green-900' : 'text-gray-700']">
                  Bank Transfer
                </p>
              </button>
            </div>
          </div>

          <!-- Donation Form -->
          <form @submit.prevent="handleDonationSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
              <select 
                v-model="donationForm.type" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Type</option>
                <option value="general">General Donation</option>
                <option value="seva">Seva Donation</option>
                <option value="festival">Festival Donation</option>
                <option value="event">Event Donation</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input 
                type="number" 
                v-model="donationForm.amount" 
                required
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter amount"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Purpose (Optional)</label>
              <textarea 
                v-model="donationForm.purpose" 
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Purpose of donation (optional)"
              ></textarea>
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                type="button" 
                @click="closeDonationForm"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="submittingDonation"
                :class="[
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                  donationForm.paymentMethod === 'bank' 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white',
                  submittingDonation ? 'opacity-50' : ''
                ]"
              >
                {{ submittingDonation ? 'Processing...' : (donationForm.paymentMethod === 'bank' ? 'View Bank Details' : 'Proceed to Payment') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: Bank Details View -->
        <div v-else class="space-y-4">
          <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div class="flex items-center gap-3 mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p class="font-semibold text-green-900">Donation Amount: ₹{{ donationForm.amount }}</p>
                <p class="text-sm text-green-700">{{ donationForm.type }} Donation</p>
              </div>
            </div>
          </div>

          <!-- Bank Details -->
          <div v-if="creatorDetails.bank" class="space-y-4">
            <h4 class="font-semibold text-gray-900">Transfer to This Account:</h4>
            
            <div class="bg-white border-2 border-gray-200 rounded-lg p-4 space-y-3">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-xs text-gray-500">Account Holder</p>
                  <p class="font-semibold text-gray-900">{{ creatorDetails.bank.account_holder_name }}</p>
                </div>
                <button 
                  @click="copyToClipboard(creatorDetails.bank.account_holder_name)"
                  class="p-2 hover:bg-gray-100 rounded"
                >
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>

              <div class="flex justify-between items-center">
                <div>
                  <p class="text-xs text-gray-500">Account Number</p>
                  <p class="text-lg font-mono font-bold text-gray-900">{{ creatorDetails.bank.account_number }}</p>
                </div>
                <button 
                  @click="copyToClipboard(creatorDetails.bank.account_number)"
                  class="p-2 hover:bg-gray-100 rounded"
                >
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>

              <div class="flex justify-between items-center">
                <div>
                  <p class="text-xs text-gray-500">IFSC Code</p>
                  <p class="font-mono font-semibold text-gray-900">{{ creatorDetails.bank.ifsc_code }}</p>
                </div>
                <button 
                  @click="copyToClipboard(creatorDetails.bank.ifsc_code)"
                  class="p-2 hover:bg-gray-100 rounded"
                >
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>

              <div class="pt-3 border-t">
                <p class="text-xs text-gray-500">Bank</p>
                <p class="text-sm text-gray-900">{{ creatorDetails.bank.bank_name }}</p>
                <p class="text-sm text-gray-600">{{ creatorDetails.bank.branch_name }}</p>
              </div>
            </div>

            <!-- UPI Option -->
            <div v-if="creatorDetails.bank.upi_id" class="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
              <p class="font-semibold text-indigo-900 mb-2">Or Pay via UPI:</p>
              <div class="flex justify-between items-center">
                <p class="text-lg font-mono font-bold text-indigo-900">{{ creatorDetails.bank.upi_id }}</p>
                <button 
                  @click="copyToClipboard(creatorDetails.bank.upi_id)"
                  class="p-2 hover:bg-indigo-100 rounded"
                >
                  <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p class="text-sm font-medium text-amber-900 mb-2">📞 After Payment:</p>
              <p class="text-xs text-amber-800">
                Please contact <span class="font-semibold">{{ creatorDetails.fullName }}</span> at 
                <span class="font-semibold">{{ creatorDetails.phone }}</span> or 
                <span class="font-semibold">{{ creatorDetails.email }}</span> 
                with your transaction details to receive your donation receipt.
              </p>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              @click="goBackToForm"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
            <button 
              type="button" 
              @click="closeDonationForm"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { donationService } from '@/services/donation.service'
import api from '@/plugins/axios'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Reactive data
const showDonationForm = ref(false)
const selectedDonation = ref(null)
const donationHistory = ref([])
const loading = ref(true)
const submittingDonation = ref(false)
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

// Temple and User info
const currentTemple = ref({
  id: null,
  name: '',
  city: '',
  state: '',
  status: '',
  createdBy: null,
})

// Creator user details with bank info
const creatorDetails = ref({
  id: null,
  fullName: '',
  email: '',
  phone: '',
  roleId: null,
  roleName: '',
  loading: false,
  error: null,
  temple: null,
  bank: null,
})

// Current logged-in user (devotee)
const currentUser = ref({
  id: null,
  name: '',
  email: '',
  phone: ''
})

// User context for entity association
const userContext = ref(null)

// Filters
const filters = ref({
  dateRange: 'all',
  donationType: 'all',
  amountRange: 'all'
})

// Donation form
const donationForm = ref({
  type: '',
  amount: '',
  purpose: '',
  paymentMethod: 'online'
})

// Computed properties
const totalDonated = computed(() => {
  return donationHistory.value.reduce((total, donation) => total + (donation.amount || 0), 0)
})

const thisMonthDonated = computed(() => {
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  
  return donationHistory.value
    .filter(donation => {
      const donationDate = new Date(donation.date || donation.created_at || donation.donatedAt)
      return donationDate.getMonth() === thisMonth && donationDate.getFullYear() === thisYear
    })
    .reduce((total, donation) => total + Number(donation.amount || 0), 0)
})

const filteredDonations = computed(() => {
  // Just return and sort - filtering is now done server-side
  return [...donationHistory.value].sort((a, b) => {
    const dateA = new Date(a.date || a.created_at || a.donatedAt)
    const dateB = new Date(b.date || b.created_at || b.donatedAt)
    return dateB - dateA
  })
})

// Methods
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const getDonationTypeClass = (type) => {
  const classes = {
    'general': 'bg-blue-100 text-blue-800',
    'seva': 'bg-green-100 text-green-800',
    'festival': 'bg-amber-100 text-amber-800',
    'construction': 'bg-purple-100 text-purple-800',
    'event': 'bg-pink-100 text-pink-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
  const statusLower = (status || '').toLowerCase()
  const classes = {
    'completed': 'bg-green-100 text-green-800',
    'success': 'bg-green-100 text-green-800',
    'pending': 'bg-amber-100 text-amber-800',
    'processing': 'bg-amber-100 text-amber-800',
    'failed': 'bg-red-100 text-red-800',
    'error': 'bg-red-100 text-red-800'
  }
  return classes[statusLower] || 'bg-gray-100 text-gray-800'
}

const getPaymentMethodClass = (method) => {
  const methodLower = (method || '').toLowerCase()
  const classes = {
    'upi': 'bg-purple-100 text-purple-800',
    'online': 'bg-indigo-100 text-indigo-800',
    'bank': 'bg-green-100 text-green-800',
    'card': 'bg-blue-100 text-blue-800',
    'cash': 'bg-gray-100 text-gray-800'
  }
  return classes[methodLower] || 'bg-gray-100 text-gray-800'
}

const getPaymentMethodLabel = (method) => {
  const m = (method || '').toLowerCase()
  const labels = {
    upi: 'UPI',
    online: 'Online (Razorpay)',
    netbanking: 'Net Banking',
    card: 'Card',
    wallet: 'Wallet',
    bank: 'Bank Transfer'
  }
  return labels[m] || method || 'N/A'
}


const resetFilters = () => {
  filters.value = {
    dateRange: 'all',
    donationType: 'all',
    amountRange: 'all'
  }
}

const viewDonationDetails = (donation) => {
  selectedDonation.value = donation
  console.log('📋 Viewing donation details:', donation)
}

const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return 'N/A'
  const accStr = accountNumber.toString()
  if (accStr.length <= 4) return accStr
  const lastFour = accStr.slice(-4)
  const masked = 'X'.repeat(accStr.length - 4)
  return masked + lastFour
}

const changePage = async (newPage) => {
  if (newPage < 1 || newPage > pagination.value.totalPages) return
  pagination.value.page = newPage
  await fetchDonationHistory()
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('✅ Copied to clipboard!')
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('✅ Copied to clipboard!')
  }
}

const handleDonationSubmit = () => {
  // Always proceed to Razorpay payment
  submitDonation()
}

const closeDonationForm = () => {
  showDonationForm.value = false
  donationForm.value = {
    type: '',
    amount: '',
    purpose: '',
    paymentMethod: 'online'
  }
}

const fetchLoggedInUser = async () => {
  try {
    const userData = localStorage.getItem('user_data')
    if (userData) {
      const parsed = JSON.parse(userData)
      currentUser.value = {
        id: parsed.id,
        name: parsed.fullName || parsed.full_name || 'Devotee',
        email: parsed.email || '',
        phone: parsed.phone || ''
      }
      console.log('👤 Logged-in user loaded:', currentUser.value)
    } else {
      console.warn('⚠️ No user_data in localStorage')
    }
  } catch (error) {
    console.error('❌ Error loading user data:', error)
  }
}

const fetchTempleInfo = async () => {
  try {
    console.log('🏛️ Fetching temple information...')

    const storedTempleName = localStorage.getItem('selectedTempleName')
    if (storedTempleName) {
      currentTemple.value.name = storedTempleName
    }

    let entityId = null
    const match = window.location.pathname.match(/\/entity\/(\d+)\//)
    if (match && match[1]) {
      entityId = match[1]
    }

    if (!entityId) {
      console.warn('⚠️ Entity ID not found in URL')
      return
    }

    console.log('✅ Using entity ID:', entityId)

    const response = await api.get(`/entities/${entityId}/details`)
    const data = response.data?.data || response.data

    console.log('🔍 Temple API Response:', data)

    if (!data || !data.id) {
      console.warn('⚠️ No temple data received')
      return
    }

    currentTemple.value = {
      id: data.id,
      name: data.name || storedTempleName || 'Temple',
      city: data.city || '',
      state: data.state || '',
      status: data.status || '',
      createdBy: data.created_by || null,
    }

    if (data.creator) {
      console.log('✅ Creator found in response')
      
      // Map bank details - handle both nested and flat structures
      let bankDetails = null
      if (data.creator.bank) {
        // Nested structure: creator.bank object exists
        bankDetails = data.creator.bank
      } else if (data.creator.account_number) {
        // Flat structure: bank details directly in creator
        bankDetails = {
          account_holder_name: data.creator.account_holder_name,
          account_number: data.creator.account_number,
          ifsc_code: data.creator.ifsc_code,
          account_type: data.creator.account_type,
          upi_id: data.creator.upi_id,
          bank_name: data.creator.bank_name || 'N/A',
          branch_name: data.creator.branch_name || 'N/A'
        }
      }
      console.log('✅ Creator details loaded:', {
        name: creatorDetails.value.fullName,
        bank: creatorDetails.value.bank ? 'Available' : 'Not available'
      })

      creatorDetails.value = {
        id: data.creator.id,
        fullName: data.creator.name || data.creator.full_name || 'N/A',
        email: data.creator.email || 'N/A',
        phone: data.creator.phone || 'N/A',
        roleName: data.creator.role || 'N/A',
        loading: false,
        error: null,
        temple: data.creator.temple || null,
        bank: bankDetails,
      }
    }

    localStorage.setItem('selectedTempleName', currentTemple.value.name)
    localStorage.setItem('selectedEntityId', currentTemple.value.id)

    console.log('✅ Temple details loaded:', currentTemple.value.name)
  } catch (error) {
    console.error('❌ Failed to fetch temple details:', error)
    currentTemple.value.name = localStorage.getItem('selectedTempleName') || 'Temple'
  }
}

const getUserContext = async () => {
  try {
    console.log('🔍 Getting user context...')
    
    if (typeof donationService.getCurrentUserContext !== 'function') {
      console.warn('⚠️ donationService.getCurrentUserContext not available')
      
      try {
        const userData = localStorage.getItem('user_data')
        if (userData) {
          const parsed = JSON.parse(userData)
          userContext.value = {
            id: parsed.id,
            user_id: parsed.id,
            user_type: parsed.roleId === 3 ? 'devotee' : 'unknown',
            temple_id: parsed.entityId,
            entity_id: parsed.entityId,
            temple_name: localStorage.getItem('selectedTempleName'),
            entity_name: localStorage.getItem('selectedTempleName')
          }
          console.log('✅ User context from localStorage:', userContext.value)
          return
        }
      } catch (parseError) {
        console.warn('⚠️ Error parsing user_data:', parseError)
      }
      
      return
    }
    
    const context = await donationService.getCurrentUserContext()
    
    if (context.success && context.data) {
      userContext.value = context.data
      console.log('✅ User context loaded:', userContext.value)
    } else {
      console.warn('⚠️ Failed to get user context:', context)
    }
  } catch (error) {
    console.error('❌ Error getting user context:', error)
  }
}

const debugDonationResponse = (response) => {
  console.log('=== DONATION RESPONSE DEBUG ===')
  console.log('Full response:', response)
  console.log('Response type:', typeof response)
  console.log('Response keys:', Object.keys(response || {}))
  
  if (response.data) {
    console.log('response.data:', response.data)
    console.log('response.data keys:', Object.keys(response.data || {}))
  }
  
  console.log('JSON stringified:', JSON.stringify(response, null, 2))
  console.log('=== END DEBUG ===')
}

const parseRazorpayResponse = (response) => {
  const possibleDataSources = [
    response,
    response.data,
    response.result,
    response.payload,
    response.order,
    response.razorpay
  ].filter(source => source && typeof source === 'object')
  
  let order_id, razorpay_key, amount
  
  for (const source of possibleDataSources) {
    order_id = order_id || 
      source.order_id || 
      source.OrderID || 
      source.orderId || 
      source.razorpay_order_id ||
      source.RazorpayOrderID ||
      source.orderID ||
      source.id
    
    razorpay_key = razorpay_key || 
      source.razorpay_key || 
      source.RazorpayKey || 
      source.razorpayKey || 
      source.key || 
      source.Key ||
      source.api_key ||
      source.ApiKey ||
      source.razorpay_api_key ||
      source.RazorpayApiKey
    
    amount = amount || 
      source.amount || 
      source.Amount || 
      source.total || 
      source.Total ||
      source.payment_amount ||
      source.PaymentAmount
  }
  
  amount = amount || Number(donationForm.value.amount)
  
  return { order_id, razorpay_key, amount }
}

const submitDonation = async () => {
  if (submittingDonation.value) return
  
  try {
    submittingDonation.value = true

    if (!donationForm.value.type || !donationForm.value.amount) {
      alert('Please fill in all required fields')
      return
    }

    if (!userContext.value) {
      await getUserContext()
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    const donationData = {
      amount: Number(donationForm.value.amount),
      donationType: donationForm.value.type,
      note: donationForm.value.purpose,
      paymentMethod: donationForm.value.paymentMethod,
    }

    if (currentTemple.value.id) {
      donationData.entityId = currentTemple.value.id
      donationData.entity_id = currentTemple.value.id
      donationData.templeId = currentTemple.value.id
      donationData.temple_id = currentTemple.value.id
    } else if (userContext.value) {
      if (userContext.value.entity_id) {
        donationData.entityId = userContext.value.entity_id
        donationData.entity_id = userContext.value.entity_id
      } else if (userContext.value.temple_id) {
        donationData.templeId = userContext.value.temple_id
        donationData.temple_id = userContext.value.temple_id
        donationData.entityId = userContext.value.temple_id
        donationData.entity_id = userContext.value.temple_id
      }
    }

    console.log('💰 Creating donation:', donationData)

    const response = await donationService.createDonation(donationData)
    debugDonationResponse(response)

    const { order_id, razorpay_key, amount } = parseRazorpayResponse(response)

    if (!order_id || !razorpay_key) {
      const missingFields = []
      if (!order_id) missingFields.push('order_id')
      if (!razorpay_key) missingFields.push('razorpay_key')
      
      throw new Error(`Server response missing: ${missingFields.join(', ')}`)
    }

    const options = {
      key: razorpay_key,
      amount: amount * 100,
      currency: "INR",
      name: currentTemple.value.name || "Temple Donation",
      description: "Thank you for your generosity!",
      order_id: order_id,
      handler: async function (response) {
        try {
          console.log('✅ Payment successful, verifying...')
          
          await donationService.verifyDonation({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Donation successful! Thank you for your generosity.");
          showDonationForm.value = false;
          
          donationForm.value = {
            type: '',
            amount: '',
            purpose: '',
            paymentMethod: 'online'
          }
          
          await fetchDonationHistory();
        } catch (verifyError) {
          console.error("❌ Verification failed:", verifyError);
          alert("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: currentUser.value.name || "Donor",
        email: currentUser.value.email || "",
      },
      theme: {
        color: "#6366f1",
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal dismissed')
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("❌ Donation error:", error);
    
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'Something went wrong'
    
    alert("Error: " + errorMessage);
  } finally {
    submittingDonation.value = false
  }
};


const fetchDonationHistory = async () => {
  try {
    loading.value = true

    console.log('📋 Fetching donation history with filters...')
    
    // Build filters object
    const filterParams = {
      page: pagination.value.page,
      limit: pagination.value.limit,
    }

    // Map frontend filters to backend
    if (filters.value.dateRange !== 'all') {
      filterParams.dateRange = filters.value.dateRange
    }

    if (filters.value.donationType !== 'all') {
      filterParams.type = filters.value.donationType
    }

    if (filters.value.amountRange !== 'all') {
      const range = filters.value.amountRange
      if (range === '0-500') {
        filterParams.minAmount = 0
        filterParams.maxAmount = 500
      } else if (range === '501-1000') {
        filterParams.minAmount = 501
        filterParams.maxAmount = 1000
      } else if (range === '1001-5000') {
        filterParams.minAmount = 1001
        filterParams.maxAmount = 5000
      } else if (range === '5000+') {
        filterParams.minAmount = 5000
      }
    }

    console.log('🔍 Filter params:', filterParams)

    // Try the new history endpoint first using the service
    let response
    try {
      response = await donationService.getDonationHistory(filterParams)
      console.log('✅ Using getDonationHistory service method')
      console.log('📊 Response:', response)
    } catch (historyError) {
      // Fallback to old endpoint if new one doesn't exist
      console.log('ℹ️ Falling back to getMyDonations service method')
      response = await donationService.getMyDonations()
    }

    // Handle response format
    if (response) {
      // If response has a data property
      if (response.data !== undefined) {
        donationHistory.value = Array.isArray(response.data) 
          ? response.data 
          : (response.data || [])
        
        // Update pagination info if available
        if (response.total !== undefined) {
          pagination.value.total = response.total
          pagination.value.page = response.page || 1
          pagination.value.limit = response.limit || 20
          pagination.value.totalPages = response.total_pages || 1
          
          console.log(`📊 Pagination: Page ${pagination.value.page} of ${pagination.value.totalPages}, Total: ${pagination.value.total}`)
        }
      } else if (Array.isArray(response)) {
        // Direct array response
        donationHistory.value = response
      } else {
        donationHistory.value = []
      }
    } else {
      donationHistory.value = []
    }
    
    console.log(`✅ Loaded ${donationHistory.value.length} donations`)
    
    if (donationHistory.value.length > 0) {
      console.log('📄 Sample donation:', donationHistory.value[0])
    }
  } catch (error) {
    console.error('❌ Error fetching donation history:', error)
    donationHistory.value = []
    
    if (error.response?.status !== 404) {
      console.warn('⚠️ Failed to load donation history:', error.response?.data?.error || error.message)
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 DonationHistory component mounted')
  
  await fetchLoggedInUser()
  await getUserContext()
  await fetchTempleInfo()
  await fetchDonationHistory()

  console.log('✅ All data loaded')
})

// Watch for filter changes and refetch from server
watch(
  () => filters.value,
  async () => {
    console.log('🔄 Filters changed, refetching data...')
    pagination.value.page = 1 // Reset to first page when filters change
    await fetchDonationHistory()
  },
  { deep: true }
)
</script>