// src/plugins/axios.js
import axios from 'axios';

// ------------------------
// Base URL Configuration
// ------------------------
const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL          // Local dev
  : import.meta.env.VITE_API_BASE_URL;    // Production HTTPS (Let’s Encrypt)

// ------------------------
// Axios instance
// ------------------------
const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ------------------------
// Development Logging
// ------------------------
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    baseURL,
    environment: import.meta.env.MODE
  });
}

// ------------------------
// Request Interceptor
// ------------------------
api.interceptors.request.use(config => {
  // Attach auth token
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Skip auth endpoints
  const isAuthEndpoint = config.url.includes('/auth/');
  if (!isAuthEndpoint) {
    // Attach Tenant ID
    const tenantId = localStorage.getItem('current_tenant_id');
    if (tenantId) config.headers['X-Tenant-ID'] = tenantId;

    // Attach Entity ID
    const entityId = localStorage.getItem('current_entity_id');
    if (entityId) config.headers['X-Entity-ID'] = entityId;
  }

  // Log requests in development
  if (import.meta.env.DEV) {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
  }

  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// ------------------------
// Response Interceptor
// ------------------------
api.interceptors.response.use(
  response => {
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  error => {
    console.error('API Error:', error.message);

    if (error.response?.status === 401) {
      const isLogin = error.config?.url?.includes('/auth/login');
      if (!isLogin) {
        // Clear auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('current_tenant_id');
        delete api.defaults.headers.common['Authorization'];
        delete api.defaults.headers.common['X-Tenant-ID'];

        // Redirect to login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?error=session_expired';
        }
      }
    }

    return Promise.reject(error);
  }
);

// ------------------------
// API Modules
// ------------------------
export const authAPI = {
  login: credentials => api.post('/auth/login', credentials),
  register: data => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/me'),
  getPublicRoles: () => api.get('/auth/public-roles')
};

export const templeAPI = {
  create: data => api.post('/tenant/temples', data),
  getAll: () => api.get('/tenant/temples'),
  getById: id => api.get(`/tenant/temples/${id}`),
  update: (id, data) => api.put(`/tenant/temples/${id}`, data),
  delete: id => api.delete(`/tenant/temples/${id}`)
};


// User role-specific endpoints
const userAPI = {
  // Devotee endpoints
  devotee: {
    getProfile: () => api.get('/devotee/profile'),
    updateProfile: (data) => api.put('/devotee/profile', data),
    joinTemple: (templeId) => api.post('/devotee/join-temple', { templeId })
  },
  
  // Volunteer endpoints
  volunteer: {
    getProfile: () => api.get('/volunteer/profile'),
    updateProfile: (data) => api.put('/volunteer/profile', data),
    joinTemple: (templeId) => api.post('/volunteer/join-temple', { templeId })
  }
}

// Admin endpoints
const adminAPI = {
  getTemples: () => api.get('/superadmin/temples'),
  getPendingTemples: () => api.get('/superadmin/temples/pending'),
  approveTemple: (id, notes) => api.post(`/superadmin/temples/${id}/approve`, { notes }),
  rejectTemple: (id, reason) => api.post(`/superadmin/temples/${id}/reject`, { reason })
}

// Event endpoints
const eventAPI = {
  getAll: () => api.get('/events'),
  getUpcoming: () => api.get('/events/upcoming'),
  getById: (id) => api.get(`/events/${id}`),
  getStats: () => api.get('/events/stats'),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`),
  getRSVPs: (eventId) => api.get(`/event-rsvps/${eventId}`),
  createRSVP: (eventId) => api.post(`/event-rsvps/${eventId}`, {})
}

// Entity Dashboard endpoints
const dashboardAPI = {
  getEntityDashboard: (entityId) => api.get(`/entities/${entityId}/dashboard`),
  getEntityEvents: (entityId, limit = 3) => api.get(`/events/upcoming?entity_id=${entityId}&limit=${limit}`),
  getEntityDonors: (entityId, limit = 5) => api.get(`/donations/top?entity_id=${entityId}&limit=${limit}`),
  getEntityNotifications: (entityId, limit = 5) => api.get(`/notifications?entity_id=${entityId}&limit=${limit}`)
}

// Notification endpoints
const communicationAPI = {
  getTemplates: () => api.get(`/notifications/templates`),
  createTemplate: (data) => api.post(`/notifications/templates`, data),
  updateTemplate: (id, data) => api.put(`/notifications/templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/notifications/templates/${id}`),

  sendBulk: (entityId, data) => api.post(`/entities/${entityId}/communication/bulk-send`, data),
  previewBulk: (entityId, data) => api.post(`/entities/${entityId}/communication/preview`, data),
  getHistory: (entityId, query) => api.get(`/entities/${entityId}/communication/history?${query}`),
  getMessageDetails: (entityId, messageId) => api.get(`/entities/${entityId}/communication/messages/${messageId}`),

  getDevotees: (entityId, query) => api.get(`/entities/${entityId}/devotees/for-messaging?${query}`),

  sendNotification: (entityId, data) => api.post(`/entities/${entityId}/communication/notifications`, data),
  getUnreadNotifications: (entityId, userId) => api.get(`/entities/${entityId}/users/${userId}/notifications/unread`),
  markNotificationAsRead: (entityId, userId, notificationId) => api.put(`/entities/${entityId}/users/${userId}/notifications/${notificationId}/read`),

  getStats: (entityId, query) => api.get(`/entities/${entityId}/communication/stats?${query}`),

  // Fixed: Single method definition for direct notifications
  sendDirectNotification: (payload) => api.post(`/notifications/send`, payload)
};

// In-app notifications (bell icon)
const inappAPI = {
  listInApp: (limit = 20) => api.get(`/notifications/inapp?limit=${limit}`),
  markInAppRead: (id) => api.put(`/notifications/inapp/${id}/read`)
}

// Reports endpoints - UPDATED WITH DEVOTEE BIRTHDAYS
const reportsAPI = {
  /**
   * Get activities report data (JSON preview)
   * @param {string} entityId - Entity ID ('all' or numeric ID)
   * @param {Object} params - Query parameters
   */
  getActivities: (entityId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/entities/${entityId}/reports/activities?${queryString}`)
  },

  /**
   * Download activities report in specified format
   * @param {string} entityId - Entity ID ('all' or numeric ID) 
   * @param {Object} params - Query parameters including format
   */
  downloadActivities: (entityId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/entities/${entityId}/reports/activities?${queryString}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/octet-stream'
      }
    })
  },

  /**
   * Get activities report by type with common parameters
   * @param {string} entityId - Entity ID ('all' or numeric ID)
   * @param {string} type - Report type ('events', 'sevas', 'bookings')
   * @param {Object} options - Additional options
   */
  getActivitiesByType: (entityId, type, options = {}) => {
    const params = {
      type,
      date_range: options.dateRange || 'weekly',
      ...options
    }
    return reportsAPI.getActivities(entityId, params)
  },

  /**
   * Download activities report by type
   * @param {string} entityId - Entity ID ('all' or numeric ID)
   * @param {string} type - Report type ('events', 'sevas', 'bookings')
   * @param {string} format - Export format ('pdf', 'csv', 'excel')
   * @param {Object} options - Additional options
   */
  downloadActivitiesByType: (entityId, type, format, options = {}) => {
    const params = {
      type,
      format,
      date_range: options.dateRange || 'weekly',
      ...options
    }
    return reportsAPI.downloadActivities(entityId, params)
  },

  // TEMPLE REGISTERED REPORTS
  getTempleRegistered: (entityId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/entities/${entityId}/reports/temple-registered?${queryString}`)
  },

  downloadTempleRegistered: (entityId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/entities/${entityId}/reports/temple-registered?${queryString}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/octet-stream'
      }
    })
  },

  // DEVOTEE BIRTHDAYS REPORTS - NEW
  /**
   * Get devotee birthdays report data (JSON preview)
   * @param {string} entityId - Entity ID ('all' or numeric ID)
   * @param {Object} params - Query parameters
   */
  getDevoteeBirthdays: (entityId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/entities/${entityId}/reports/devotee-birthdays?${queryString}`)
  },

  /**
   * Download devotee birthdays report in specified format
   * @param {string} entityId - Entity ID ('all' or numeric ID)
   * @param {Object} params - Query parameters including format
   */
  downloadDevoteeBirthdays: (entityId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/entities/${entityId}/reports/devotee-birthdays?${queryString}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/octet-stream'
      }
    })
  }
}

// Export structured API client
export const apiClient = {
  auth: authAPI,
  temple: templeAPI,
  user: userAPI,
  admin: adminAPI,
  event: eventAPI,
  dashboard: dashboardAPI,
  communication: communicationAPI,
  inapp: inappAPI,
  reports: reportsAPI
}

// Default export for backward compatibility
export default api