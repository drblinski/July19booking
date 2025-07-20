/**
 * Formatting Utilities
 * Provides date, time, and text formatting functions
 * Ensures consistent formatting across the application
 */

const Format = {
  /**
   * Format date for display in calendar
   * @param {Date} date - Date to format
   * @returns {string} - Formatted date string
   */
  calendarDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format time for display in time slots
   * @param {Date|string} time - Time to format (Date object or ISO string)
   * @returns {string} - Formatted time string
   */
  time(time) {
    const timeObj = typeof time === 'string' ? new Date(time) : time;
    return timeObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Format date for API calls (YYYY-MM-DD)
   * @param {Date} date - Date to format
   * @returns {string} - ISO date string
   */
  apiDate(date) {
    return date.toISOString().split('T')[0];
  },

  /**
   * Format price for display
   * @param {number} cents - Price in cents
   * @returns {string} - Formatted price string
   */
  price(cents) {
    if (!cents) return 'Contact for pricing';
    return `$${Math.round(cents / 100)}`;
  },

  /**
   * Format duration for display
   * @param {number} minutes - Duration in minutes
   * @returns {string} - Formatted duration string
   */
  duration(minutes) {
    if (!minutes) return '';
    return `${minutes} minutes`;
  },

  /**
   * Format phone number for display
   * @param {string} phone - Raw phone number
   * @returns {string} - Formatted phone number
   */
  phone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
  }
};
