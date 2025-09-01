<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Page Header with improved styling -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold font-['Roboto'] text-gray-800 mb-1">
          Tenant User Management
        </h1>
        <p class="text-gray-500 text-sm">Manage users and assign roles to your tenant</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 flex items-center mt-4 md:mt-0 transform hover:scale-105"
      >
        <span class="mr-2 font-medium">Create User</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Stats Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Users Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg">
        <div class="flex items-center">
          <div class="p-3 rounded-xl bg-indigo-100 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Total Users</p>
            <h3 class="text-2xl font-bold text-gray-800">{{ users.length }}</h3>
          </div>
        </div>
      </div>
      
      <!-- Standard Users Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg">
        <div class="flex items-center">
          <div class="p-3 rounded-xl bg-green-100 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Standard Users</p>
            <h3 class="text-2xl font-bold text-gray-800">{{ standardUsersCount }}</h3>
          </div>
        </div>
      </div>
      
      <!-- Monitoring Users Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg">
        <div class="flex items-center">
          <div class="p-3 rounded-xl bg-blue-100 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Monitoring Users</p>
            <h3 class="text-2xl font-bold text-gray-800">{{ monitoringUsersCount }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- User Management Table with enhanced card styling -->
    <div class="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100 transition-all duration-200 hover:shadow-lg">
      <UserManagementTable :users="users" />
    </div>

    <!-- Create User Modal -->
    <Transition name="modal-fade">
      <CreateUserModal
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @create="createUser"
      />
    </Transition>
    
    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.show" class="fixed bottom-4 right-4 bg-white shadow-lg rounded-xl p-4 max-w-md border-l-4" :class="toast.type === 'success' ? 'border-green-500' : 'border-red-500'">
        <div class="flex items-center">
          <div v-if="toast.type === 'success'" class="mr-3 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div v-else class="mr-3 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p>{{ toast.message }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import UserManagementTable from '@/components/tenant/UserManagementTable.vue';
import CreateUserModal from '@/components/tenant/CreateUserModal.vue';

// State
const showCreateModal = ref(false);
const users = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901',
    role: 'StandardUser',
    createdAt: '2024-08-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 234 567 8902',
    role: 'MonitoringUser',
    createdAt: '2024-08-10'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1 234 567 8903',
    role: 'StandardUser',
    createdAt: '2024-08-05'
  }
]);

// Toast notification state
const toast = ref({
  show: false,
  message: '',
  type: 'success', // 'success' or 'error'
});

// Computed properties
const standardUsersCount = computed(() => {
  return users.value.filter(user => user.role === 'StandardUser').length;
});

const monitoringUsersCount = computed(() => {
  return users.value.filter(user => user.role === 'MonitoringUser').length;
});

// Methods
const createUser = (userData) => {
  console.log('Creating user:', userData);
  
  // Check if user already exists
  const existingUserIndex = users.value.findIndex(user => user.email === userData.email);
  
  if (existingUserIndex !== -1) {
    // User exists, update role
    users.value[existingUserIndex].role = userData.role;
    showToast('User reassigned to new role successfully.', 'success');
  } else {
    // Create new user
    const newUser = {
      id: users.value.length + 1,
      ...userData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    users.value.push(newUser);
    showToast('User created and assigned to this tenant successfully.', 'success');
  }
  
  // Close modal
  showCreateModal.value = false;
};

const showToast = (message, type = 'success') => {
  toast.value = {
    show: true,
    message,
    type
  };
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};
</script>

<style scoped>
/* Toast animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Modal animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>