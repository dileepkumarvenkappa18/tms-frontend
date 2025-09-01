<template>
  <div class="assign-tenants-view">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-center">
        <a @click="goBack" class="cursor-pointer text-indigo-600 hover:text-indigo-800 mr-2">
          <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </a>
        <div>
          <h2 class="text-xl font-bold">Assign Tenants to User</h2>
        </div>
      </div>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <!-- Card header -->
      <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold">Assign Tenants to User</h2>
        <button 
          @click="goBack" 
          class="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
          Back
        </button>
      </div>

      <!-- Card body -->
      <div class="p-6">
        <!-- Loading -->
        <div v-if="loading" class="py-10 flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <p class="text-red-700">{{ error }}</p>
          <button @click="fetchUserDetails" class="text-red-600 mt-2 underline">
            Retry
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- User Info -->
          <div class="bg-indigo-50 border border-indigo-100 rounded p-4 mb-6">
            <h3 class="font-medium text-indigo-800 mb-2">User Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Name -->
              <div>
                <p class="text-gray-500 text-sm">Name</p>
                <p class="font-medium">{{ user.full_name || user.fullName }}</p>
              </div>

              <!-- Email -->
              <div>
                <p class="text-gray-500 text-sm">Email</p>
                <p class="font-medium">{{ user.email }}</p>
              </div>

              <!-- Role -->
              <div>
                <p class="text-gray-500 text-sm">Role</p>
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  {{ userRole }}
                </span>
              </div>

              <!-- Assigned or Not -->
              <div>
                <p class="text-gray-500 text-sm">Assigned</p>
                <p class="font-medium">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.assigned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ user.assigned ? 'Yes' : 'No' }}
                  </span>
                </p>
              </div>

              <!-- Assigned Date -->
              <div>
                <p class="text-gray-500 text-sm">Assigned Date</p>
                <p class="font-medium">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded bg-gray-100 text-gray-800">
                    {{ formattedAssignedDate }}
                  </span>
                </p>
              </div>

              <!-- Reassigment Date -->
              <div>
                <p class="text-gray-500 text-sm">Re-Assign Date</p>
                <p class="font-medium">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded bg-gray-100 text-gray-800">
                    {{ formattedReassignmentDate }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Role Restriction -->
          <div 
            v-if="!canAssignTenants" 
            class="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
            <p class="text-yellow-800">
              Tenant assignment is only available for Standard User and Monitoring User roles.
            </p>
          </div>

          <!-- Tenant Selection Table -->
          <tenant-selection-table 
            v-else
            :user-id="userId" 
            @assign="assignTenantHandler" 
            @cancel="goBack" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import superAdminService from '@/services/superadmin.service';
import TenantSelectionTable from '@/components/superadmin/TenantSelectionTable.vue';

export default {
  name: 'AssignTenantsView',
  components: { TenantSelectionTable },

  setup() {
    const router = useRouter();
    const route = useRoute();

    const userId = ref(route.params.userId);
    const user = ref({});
    const loading = ref(true);
    const error = ref('');

    const userRole = computed(() => {
      if (!user.value) return '';
      if (typeof user.value.role === 'string') return user.value.role;
      if (typeof user.value.role === 'object') {
        return user.value.role.roleName || user.value.role.role_name || '';
      }
      return '';
    });

    const canAssignTenants = computed(() => {
      const role = userRole.value.toLowerCase().replace(/\s+/g, '');
      return ['standarduser', 'monitoringuser'].includes(role);
    });

    // ✅ Format assigned/reassignment dates (YYYY-MM-DD only)
    const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toISOString().split('T')[0];
    };

    const formattedAssignedDate = computed(() => formatDate(user.value.assignedDate));
    const formattedReassignmentDate = computed(() => formatDate(user.value.reassignmentDate));

    const fetchUserDetails = async () => {
      loading.value = true;
      error.value = '';
      try {
        const response = await superAdminService.getUserById(userId.value);
        if (response.success) {
          user.value = response.data;
        } else {
          error.value = response.message || 'Failed to load user details';
        }
      } catch (err) {
        error.value = 'An error occurred while loading user details. Please try again.';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const assignTenantHandler = async ({ tenantId }) => {
      if (!tenantId) return alert('Invalid tenant selected');
      if (!canAssignTenants.value) return alert('This user cannot be assigned tenants');

      loading.value = true;
      try {
        const response = await superAdminService.assignUserToTenant(userId.value, tenantId);
        if (response.success) {
          alert('Tenant assigned successfully');
          loading.value = false;
          router.push({ name: 'SuperadminUserManagement' });
        } else {
          loading.value = false;
          alert(response.message || 'Failed to assign tenant');
        }
      } catch (err) {
        console.error(err);
        loading.value = false;
        alert('An error occurred while assigning tenant');
      }
    };

    const goBack = () => router.push({ name: 'SuperadminUserManagement' });

    onMounted(fetchUserDetails);

    return { 
      userId,
      user,
      loading,
      error,
      fetchUserDetails,
      goBack,
      userRole,
      canAssignTenants,
      assignTenantHandler,
      formattedAssignedDate,
      formattedReassignmentDate
    };
  }
};
</script>