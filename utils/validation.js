/**
 * Validation Utilities
 * Provides common validation functions for email, phone, and other inputs
 * Used across multiple steps for consistent validation logic
 */

const Validation = {
  /**
   * Validate email address format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid email format
   */
  email(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - True if valid phone format (10-15 digits)
   */
  phone(phone) {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  },

  /**
   * Check if value is required and not empty
   * @param {string} value - Value to check
   * @returns {boolean} - True if value exists and not just whitespace
   */
  required(value) {
    return value && value.trim().length > 0;
  },

  /**
   * Validate form field and show error if invalid
   * @param {string} fieldId - DOM element ID
   * @param {string} value - Value to validate
   * @param {string} type - Validation type ('required', 'email', 'phone')
   * @returns {boolean} - True if valid
   */
  validateField(fieldId, value, type) {
    const field = document.getElementById(fieldId);
    
    // Clear previous errors
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-text');
    if (existingError) {
      existingError.remove();
    }

    let isValid = true;
    let errorMessage = '';

    switch(type) {
      case 'required':
        if (!this.required(value)) {
          isValid = false;
          errorMessage = CONFIG.TEXT.ERRORS.REQUIRED_FIELD;
        }
        break;
      case 'email':
        if (!this.required(value)) {
          isValid = false;
          errorMessage = CONFIG.TEXT.ERRORS.REQUIRED_FIELD;
        } else if (!this.email(value)) {
          isValid = false;
          errorMessage = CONFIG.TEXT.ERRORS.INVALID_EMAIL;
        }
        break;
      case 'phone':
        if (!this.required(value)) {
          isValid = false;
          errorMessage = CONFIG.TEXT.ERRORS.REQUIRED_FIELD;
        } else if (!this.phone(value)) {
          isValid = false;
          errorMessage = CONFIG.TEXT.ERRORS.INVALID_PHONE;
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  },

  /**
   * Show error message for a specific field
   * @param {HTMLElement} field - DOM element to show error for
   * @param {string} message - Error message to display
   */
  showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-text';
    errorDiv.textContent = message;
    
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
  }
};
