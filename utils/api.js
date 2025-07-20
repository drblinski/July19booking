/**
 * API Communication Layer
 * Handles all communication with the Get Plump booking API service
 * Provides abstracted methods for booking operations
 */

const API = {
  /**
   * Generic API request handler
   * @param {string} endpoint - API endpoint (relative to base URL)
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} - API response data
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${CONFIG.API.baseUrl}${endpoint}`;
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: CONFIG.API.timeout
    };

    const requestOptions = { ...defaultOptions, ...options };

    // Add request body for POST/PUT requests
    if (requestOptions.body && typeof requestOptions.body === 'object') {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }

    console.log('🔥 API Request:', { url, options: requestOptions });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout);
      
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('🔥 API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🔥 API Response data:', data);
      
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      
      console.error('🔥 API Request failed:', error);
      
      // Provide user-friendly error messages
      if (!navigator.onLine) {
        throw new Error(CONFIG.TEXT.ERRORS.NETWORK_ERROR);
      }
      
      throw new Error(error.message || CONFIG.TEXT.ERRORS.API_ERROR);
    }
  },

  /**
   * Get all available locations
   * @returns {Promise<Array>} - Array of location objects
   */
  async getLocations() {
    return await this.makeRequest(CONFIG.API.endpoints.locations);
  },

  /**
   * Get staff for a specific location or all locations
   * @param {string} locationId - Optional location ID to filter staff
   * @returns {Promise<Array>} - Array of staff objects
   */
  async getStaff(locationId = null) {
    const endpoint = locationId 
      ? `${CONFIG.API.endpoints.staff}?locationId=${locationId}`
      : CONFIG.API.endpoints.staff;
    
    return await this.makeRequest(endpoint);
  },

  /**
   * Create a new booking cart/session
   * @param {string} locationId - Location ID
   * @param {Object} options - Additional cart options
   * @returns {Promise<Object>} - Cart object
   */
  async createCart(locationId, options = {}) {
    return await this.makeRequest(CONFIG.API.endpoints.cart, {
      method: 'POST',
      body: {
        locationId,
        ...options
      }
    });
  },

  /**
   * Get available services for a location and treatment type
   * @param {string} locationId - Location ID
   * @param {string} treatmentType - Treatment type filter
   * @param {string} staffId - Optional staff ID filter
   * @returns {Promise<Array>} - Array of service objects
   */
  async getServices(locationId, treatmentType, staffId = null) {
    const params = new URLSearchParams({
      locationId,
      treatmentType
    });
    
    if (staffId) {
      params.append('staffId', staffId);
    }
    
    return await this.makeRequest(`${CONFIG.API.endpoints.services}?${params}`);
  },

  /**
   * Add a service to the cart
   * @param {string} cartId - Cart ID
   * @param {string} serviceId - Service ID to add
   * @param {string} staffId - Optional specific staff member
   * @returns {Promise<Object>} - Updated cart object
   */
  async addServiceToCart(cartId, serviceId, staffId = null) {
    return await this.makeRequest(`${CONFIG.API.endpoints.cart}/${cartId}/items`, {
      method: 'POST',
      body: {
        serviceId,
        staffId
      }
    });
  },

  /**
   * Get available appointment times
   * @param {string} cartId - Cart ID
   * @param {Date} date - Date to check availability
   * @param {string} staffId - Optional staff ID filter
   * @returns {Promise<Array>} - Available time slots
   */
  async getAvailableTimes(cartId, date, staffId = null) {
    const params = new URLSearchParams({
      cartId,
      date: Format.apiDate(date)
    });
    
    if (staffId) {
      params.append('staffId', staffId);
    }
    
    return await this.makeRequest(`${CONFIG.API.endpoints.availability}?${params}`);
  },

  /**
   * Get availability for a specific staff member across multiple dates/locations
   * @param {string} staffId - Staff member ID
   * @param {Date} startDate - Start date for availability window
   * @param {Date} endDate - End date for availability window
   * @returns {Promise<Object>} - Availability data organized by date/location
   */
  async getStaffAvailability(staffId, startDate, endDate) {
    const params = new URLSearchParams({
      staffId,
      startDate: Format.apiDate(startDate),
      endDate: Format.apiDate(endDate)
    });
    
    return await this.makeRequest(`${CONFIG.API.endpoints.availability}/staff?${params}`);
  },

  /**
   * Reserve a time slot
   * @param {string} cartId - Cart ID
   * @param {string} timeSlotId - Time slot ID to reserve
   * @returns {Promise<Object>} - Updated cart with reservation
   */
  async reserveTimeSlot(cartId, timeSlotId) {
    return await this.makeRequest(`${CONFIG.API.endpoints.cart}/${cartId}/reserve`, {
      method: 'POST',
      body: {
        timeSlotId
      }
    });
  },

  /**
   * Update cart with client information
   * @param {string} cartId - Cart ID
   * @param {Object} clientInfo - Client information object
   * @returns {Promise<Object>} - Updated cart
   */
  async updateCartWithClientInfo(cartId, clientInfo) {
    return await this.makeRequest(`${CONFIG.API.endpoints.cart}/${cartId}/client`, {
      method: 'PUT',
      body: clientInfo
    });
  },

  /**
   * Complete the booking
   * @param {string} cartId - Cart ID
   * @param {Object} paymentInfo - Optional payment information
   * @returns {Promise<Object>} - Booking confirmation
   */
  async completeBooking(cartId, paymentInfo = null) {
    return await this.makeRequest(CONFIG.API.endpoints.booking, {
      method: 'POST',
      body: {
        cartId,
        paymentInfo
      }
    });
  },

  /**
   * Get booking details
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Object>} - Booking details
   */
  async getBooking(bookingId) {
    return await this.makeRequest(`${CONFIG.API.endpoints.booking}/${bookingId}`);
  },

  /**
   * Cancel a booking
   * @param {string} bookingId - Booking ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} - Cancellation confirmation
   */
  async cancelBooking(bookingId, reason) {
    return await this.makeRequest(`${CONFIG.API.endpoints.booking}/${bookingId}/cancel`, {
      method: 'POST',
      body: { reason }
    });
  }
};
