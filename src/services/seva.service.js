
// src/services/seva.service.js - Updated version with slot management and Razorpay payment
import axios from 'axios'

class SevaService {

  /**
   * Get all sevas for the current entity (temple) - matches /entity-sevas route
   * @param {Object} params - Query parameters for filtering (seva_type, search, page, limit)
   * @returns {Promise<Object>} Seva list with pagination
   */
  async getSevas(params = {}) {
    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      console.log(`Fetching sevas for entity ID: ${entityId}, tenant ID: ${tenantId}`);
      
      if (entityId) {
        localStorage.setItem('current_entity_id', entityId);
      }
      
      const url = entityId ? `/sevas/entity-sevas?entity_id=${entityId}` : '/sevas/entity-sevas';
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId,
          'X-Entity-ID': entityId
        }
      };
      
      console.log(`Requesting sevas from: ${url} with params:`, params);
      
      const requestParams = {
        ...params,
        entity_id: entityId
      };
      
      const response = await axios.get(url, { 
        ...headers,
        params: requestParams 
      });
      
      console.log('Seva response:', response.data);
      
      // ✅ Ensure slot fields are included in response
      const sevas = (response.data?.sevas || []).map(seva => ({
        ...seva,
        available_slots: seva.available_slots || seva.AvailableSlots || 0,
        booked_slots: seva.booked_slots || seva.BookedSlots || 0,
        remaining_slots: seva.remaining_slots || seva.RemainingSlots || 0
      }));
      
      return {
        success: true,
        data: sevas,
        total: response.data?.total || 0,
        pagination: response.data?.pagination || {}
      }
    } catch (error) {
      console.error('Error fetching sevas:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch sevas',
        data: []
      }
    }
  }

  /**
   * Get all sevas for devotees - matches / route with devotee middleware
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise<Object>} Seva list with pagination
   */
  async getDevoteeSevas(params = {}) {
    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      console.log('Requesting devotee sevas with params:', params);
      console.log(`Devotee sevas for entity ID: ${entityId}, tenant ID: ${tenantId}`);
      
      const url = entityId ? `/sevas?entity_id=${entityId}` : '/sevas';
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId,
          'X-Entity-ID': entityId
        }
      };
      
      const requestParams = {
        ...params,
        entity_id: entityId
      };
      
      const response = await axios.get(url, { 
        ...headers,
        params: requestParams 
      });
      
      console.log('Devotee seva response:', response.data);
      
      // ✅ Ensure slot fields are included in response
      const sevas = (response.data?.sevas || []).map(seva => ({
        ...seva,
        available_slots: seva.available_slots || seva.AvailableSlots || 0,
        booked_slots: seva.booked_slots || seva.BookedSlots || 0,
        remaining_slots: seva.remaining_slots || seva.RemainingSlots || 0
      }));
      
      return {
        success: true,
        data: sevas,
        pagination: response.data?.pagination || {}
      }
    } catch (error) {
      console.error('Error fetching devotee sevas:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch sevas',
        data: []
      }
    }
  }

  /**
   * Get seva by ID - matches /:id route
   * @param {string} sevaId - Seva ID
   * @returns {Promise<Object>} Seva details
   */
  async getSevaById(sevaId) {
    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId,
          'X-Entity-ID': entityId
        }
      };
      
      console.log(`Fetching seva ${sevaId} for entity ID: ${entityId}`);
      const response = await axios.get(`v1/sevas/${sevaId}`, headers);
      
      // ✅ Ensure slot fields are included
      const seva = response.data || null;
      if (seva) {
        seva.available_slots = seva.available_slots || seva.AvailableSlots || 0;
        seva.booked_slots = seva.booked_slots || seva.BookedSlots || 0;
        seva.remaining_slots = seva.remaining_slots || seva.RemainingSlots || 0;
      }
      
      return {
        success: true,
        data: seva
      }
    } catch (error) {
      console.error('Error fetching seva:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch seva details',
        data: null
      }
    }
  }

  /**
   * Get booking counts - matches /booking-counts route
   * @returns {Promise<Object>} Booking statistics
   */
  async getBookingCounts() {
    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      console.log(`Fetching booking counts for entity ID: ${entityId}, tenant ID: ${tenantId}`);
      
      const url = entityId ? `/sevas/booking-counts?entity_id=${entityId}` : '/sevas/booking-counts';
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId,
          'X-Entity-ID': entityId
        }
      };
      
      const response = await axios.get(url, headers);
      
      console.log('Booking counts response:', response.data);
      return {
        success: true,
        data: response.data || {}
      }
    } catch (error) {
      console.error('Error fetching booking counts:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch booking counts',
        data: {
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0
        }
      }
    }
  }

  /**
   * Create a new seva - matches POST / route
   * ✅ UPDATED: Uses available_slots instead of max_bookings_per_day
   * @param {Object} sevaData - Seva data to create
   * @returns {Promise<Object>} Creation response
   */
  async createSeva(sevaData) {
    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      if (!entityId) {
        throw new Error('No entity ID available for seva creation');
      }

      // ✅ UPDATED: Map to new slot field names
      const apiData = {
        name: sevaData.name,
        seva_type: sevaData.seva_type || sevaData.sevaType,
        description: sevaData.description || '',
        price: sevaData.price || 0,
        date: sevaData.date || sevaData.seva_date,
        start_time: sevaData.start_time || sevaData.startTime,
        end_time: sevaData.end_time || sevaData.endTime,
        duration: sevaData.duration || 30,
        available_slots: sevaData.available_slots || sevaData.availableSlots || sevaData.max_bookings_per_day || sevaData.maxBookingsPerDay || 10, // ✅ UPDATED
        entity_id: parseInt(entityId)
      };

      console.log('Creating seva with data:', apiData);
      console.log('Entity ID being used:', entityId);
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Entity-ID': entityId,
          'X-Tenant-ID': tenantId
        }
      };
      
      const response = await axios.post('/sevas', apiData, headers);
      console.log('Seva created successfully:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: 'Seva created successfully'
      }
    } catch (error) {
      console.error('Error creating seva:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create seva',
        errors: error.response?.data?.errors || {}
      }
    }
  }

  /**
   * Update seva - matches PUT /:id route
   * ✅ UPDATED: Uses available_slots instead of max_bookings_per_day
   * @param {string} sevaId - Seva ID to update
   * @param {Object} sevaData - Updated seva data
   * @returns {Promise<Object>} Update response
   */
  async updateSeva(sevaId, sevaData) {
    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      // ✅ UPDATED: Map to new slot field names
      const apiData = {
        name: sevaData.name,
        seva_type: sevaData.seva_type || sevaData.sevaType,
        description: sevaData.description || '',
        price: sevaData.price || 0,
        date: sevaData.date || sevaData.seva_date,
        start_time: sevaData.start_time || sevaData.startTime,
        end_time: sevaData.end_time || sevaData.endTime,
        duration: sevaData.duration || 30,
        available_slots: sevaData.available_slots || sevaData.availableSlots || sevaData.max_bookings_per_day || sevaData.maxBookingsPerDay, // ✅ UPDATED
        status: sevaData.status
      };

      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Entity-ID': entityId,
          'X-Tenant-ID': tenantId
        }
      };

      console.log('Updating seva with ID:', sevaId, 'Data:', apiData);
      console.log('Entity ID context:', entityId);
      
      const response = await axios.put(`/sevas/${sevaId}`, apiData, headers);
      
      return {
        success: true,
        data: response.data,
        message: 'Seva updated successfully',
        wasUpdate: true,
        id: sevaId
      }
    } catch (error) {
      console.error('Error updating seva:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update seva',
        errors: error.response?.data?.errors || {}
      }
    }
  }

  /**
   * Delete seva - HARD DELETE - matches DELETE /:id route
   * @param {string} sevaId - Seva ID to delete permanently
   * @returns {Promise<Object>} Delete response
   */
  async deleteSeva(sevaId) {
    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      console.log('Permanently deleting seva with ID:', sevaId);
      console.log('Entity context:', entityId);
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Entity-ID': entityId,
          'X-Tenant-ID': tenantId,
          'X-Force-Delete': 'true'
        }
      };
      
      const response = await axios.delete(`/sevas/${sevaId}`, {
        ...headers,
        params: { 
          force: true,
          permanent: true
        }
      });
      
      console.log('Delete response:', response.data);
      
      return {
        success: true,
        message: 'Seva permanently deleted successfully',
        id: sevaId
      }
    } catch (error) {
      console.error('Error deleting seva:', error);
      console.error('Delete error details:', error.response?.data);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Seva not found or already deleted'
        }
      } else if (error.response?.status === 409) {
        return {
          success: false,
          error: 'Cannot delete seva - it has existing bookings. Please contact administrator.'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to permanently delete seva'
      }
    }
  }

  /**
   * Book a seva - matches POST /bookings route (devotee only)
   * @param {number} sevaId - Seva ID to book
   * @returns {Promise<Object>} Booking response
   */
  async bookSeva(sevaId) {
    const payload = { seva_id: sevaId };

    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Entity-ID': entityId,
          'X-Tenant-ID': tenantId
        }
      };
      
      console.log(`Booking seva ${sevaId} for entity ${entityId}`);
      const response = await axios.post('/sevas/bookings', payload, headers);

      return {
        success: true,
        data: response.data,
        message: 'Seva booking request submitted successfully'
      };
    } catch (error) {
      console.error('Error booking seva:', error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to book seva'
      };
    }
  }

  // src/services/seva.service.js - Fixed entity_id type conversion

/**
 * ✅ NEW: Create a seva booking with Razorpay payment order
 * @param {Object} bookingData - Contains seva_id, amount, entity_id, etc.
 * @returns {Promise} Response with order_id and razorpay_key
 */
async createSevaBookingWithPayment(bookingData) {
  try {
    const entityId = this.getCurrentEntityId();
    const tenantId = localStorage.getItem('current_tenant_id');
    
    console.log('Creating seva booking with payment:', bookingData)
    
    const headers = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',
        'X-Entity-ID': entityId,
        'X-Tenant-ID': tenantId
      }
    };
    
    // ✅ FIX: Convert all ID fields to integers
    const payload = {
      seva_id: parseInt(bookingData.seva_id),
      amount: Number(bookingData.amount),
      entity_id: parseInt(bookingData.entity_id || bookingData.entityId || entityId),
      temple_id: parseInt(bookingData.temple_id || bookingData.templeId || entityId),
      seva_name: bookingData.seva_name,
      seva_type: bookingData.seva_type
    };
    
    console.log('Payload with correct types:', payload)
    
    const response = await axios.post('/sevas/book-with-payment', payload, headers);
    
    console.log('Seva booking payment response:', response.data)
    
    // Return the response data which should contain order_id and razorpay_key
    return response.data
  } catch (error) {
    console.error('Error creating seva booking with payment:', error)
    throw error
  }
}

  /**
   * ✅ NEW: Verify seva payment after Razorpay success
   * @param {Object} paymentData - Contains razorpay_payment_id, razorpay_order_id, razorpay_signature, seva_id
   * @returns {Promise} Verification result
   */
  async verifySevaPayment(paymentData) {
    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      console.log('Verifying seva payment:', paymentData)
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Entity-ID': entityId,
          'X-Tenant-ID': tenantId
        }
      };
      
      const response = await axios.post('/sevas/verify-payment', {
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        seva_id: paymentData.seva_id
      }, headers);
      
      console.log('Seva payment verification response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error verifying seva payment:', error)
      throw error
    }
  }

  /**
   * Get user's seva bookings - matches GET /my-bookings route (devotee only)
   * @param {string} entityId - Optional entity ID to filter bookings
   * @returns {Promise<Object>} User's booking history
   */
  async getMyBookings(entityId = null) {
    try {
      const resolvedEntityId = entityId || this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      console.log(`Fetching my bookings for entity ${resolvedEntityId}`);
      
      const url = resolvedEntityId ? 
        `/sevas/my-bookings?entity_id=${resolvedEntityId}` : 
        '/sevas/my-bookings';
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Entity-ID': resolvedEntityId,
          'X-Tenant-ID': tenantId
        }
      };
      
      const response = await axios.get(url, headers);
      
      let bookings = response.data?.bookings || [];
      
      if (resolvedEntityId) {
        bookings = bookings.filter(booking => {
          const bookingEntityId = booking.entity_id || booking.EntityID || booking.entityId;
          return bookingEntityId && parseInt(bookingEntityId) === parseInt(resolvedEntityId);
        });
        console.log(`✅ Filtered ${bookings.length} bookings for entity ${resolvedEntityId}`);
      }
      
      return {
        success: true,
        data: bookings
      };
    } catch (error) {
      console.error('Error fetching my bookings:', error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch booking history',
        data: []
      };
    }
  }

  /**
   * Get entity bookings - matches GET /entity-bookings route (temple admin)
   * @param {string} entityId - Optional entity ID to filter bookings
   * @returns {Promise<Object>} Entity bookings with pagination
   */
  async getEntityBookings(entityId) {
    try {
      const resolvedEntityId = entityId || this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      console.log(`Fetching entity bookings for entity ID: ${resolvedEntityId}, tenant ID: ${tenantId}`);
      
      const url = resolvedEntityId ? 
        `/sevas/entity-bookings?entity_id=${resolvedEntityId}` : 
        '/sevas/entity-bookings';
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Entity-ID': resolvedEntityId,
          'X-Tenant-ID': tenantId
        }
      };
      
      console.log(`Requesting entity bookings from: ${url}`);
      const response = await axios.get(url, headers);
      
      console.log('Entity bookings response:', response.data);
      return {
        success: true,
        data: response.data.bookings || [], 
        pagination: response.data.pagination || {},
        total: response.data.total || 0
      }
    } catch (error) {
      console.error('Error fetching entity bookings:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch bookings',
        data: []
      }
    }
  }

  /**
   * Get booking by ID - matches GET /bookings/:id route (temple admin)
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Object>} Booking details
   */
  async getBookingById(bookingId) {
    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Entity-ID': entityId,
          'X-Tenant-ID': tenantId
        }
      };
      
      console.log(`Fetching booking ${bookingId} for entity ${entityId}`);
      const response = await axios.get(`/sevas/bookings/${bookingId}`, headers);
      
      return {
        success: true,
        data: response.data || null
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch booking details',
        data: null
      }
    }
  }

  /**
   * Update booking status - matches PATCH /bookings/:id/status route (temple admin)
   * ✅ This triggers slot updates on the backend
   * @param {string} bookingId - Booking ID
   * @param {string} status - New status (approved, rejected, etc.)
   * @returns {Promise<Object>} Status update response
   */
  async updateBookingStatus(bookingId, status) {
    try {
      const entityId = this.getCurrentEntityId();
      const tenantId = localStorage.getItem('current_tenant_id');
      
      const headers = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'X-Entity-ID': entityId,
          'X-Tenant-ID': tenantId
        }
      };
      
      console.log(`Updating booking ${bookingId} status to ${status} for entity ${entityId}`);
      const response = await axios.patch(`/sevas/bookings/${bookingId}/status`, 
        { status }, 
        headers
      );
      
      return {
        success: true,
        data: response.data,
        message: `Booking ${status} successfully`
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update booking status'
      }
    }
  }

  // Helper method to get current entity ID
  getCurrentEntityId() {
    const currentPath = window.location.pathname;
    const entityMatch = currentPath.match(/\/entity\/(\d+)/);
    if (entityMatch) {
      const entityId = entityMatch[1];
      console.log(`Entity ID from URL path: ${entityId}`);
      return entityId;
    }

    const storedEntityId = localStorage.getItem('current_entity_id');
    if (storedEntityId && storedEntityId !== 'null' && storedEntityId !== 'undefined') {
      console.log(`Entity ID from localStorage: ${storedEntityId}`);
      return storedEntityId;
    }

    const userInfo = this.getUserInfo();
    if (userInfo) {
      switch (userInfo.role) {
        case 'templeadmin':
          if (userInfo.entityId) {
            console.log(`TempleAdmin entity ID: ${userInfo.entityId}`);
            return userInfo.entityId.toString();
          }
          break;
        
        case 'standarduser':
        case 'monitoringuser':
          if (userInfo.assignedTenantId) {
            console.log(`StandardUser/MonitoringUser assigned tenant ID: ${userInfo.assignedTenantId}`);
            return userInfo.assignedTenantId.toString();
          }
          break;
      }
    }

    console.warn('Could not resolve entity ID for seva service');
    return null;
  }

  getUserInfo() {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          userId: payload.user_id,
          role: payload.role || payload.role_name,
          entityId: payload.entity_id,
          assignedTenantId: payload.assigned_tenant_id
        };
      }
    } catch (error) {
      console.warn('Error parsing user info from token:', error);
    }
    return null;
  }

  handleError(error) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    } else if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    } else if (error.message) {
      return new Error(error.message);
    } else {
      return new Error('An unexpected error occurred');
    }
  }
}

export const sevaService = new SevaService()
export default sevaService