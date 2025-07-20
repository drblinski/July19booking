/**
 * Step 8: Collect User Info
 * Purpose: Display form to collect client contact information
 * Inputs: app.state with booking details
 * Outputs: clientInfo saved to app.state, validated form data, proceeds to confirmation step
 * Integration: Called from calendar step, calls confirmation step
 */

const UserInfoStep = {
  /**
   * Show user information form
   */
  show() {
    console.log('Step 8: User Information Collection');
    
    setTimeout(() => {
      this.showClientInfoForm();
    }, 1000);
  },

  /**
   * Create and display client information form
   */
  showClientInfoForm() {
    const formContainer = this.createFormContainer();
    MessageBubble.add('system', formContainer);
    
    // Focus on first input after form is added to DOM
    setTimeout(() => {
      const firstNameInput = document.getElementById('firstName');
      if (firstNameInput) {
        firstNameInput.focus();
      }
    }, 100);
  },

  /**
   * Create form container with all form elements
   * @returns {HTMLElement} - Form container
   */
  createFormContainer() {
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';
    
    // Form title
    const contactTitle = document.createElement('div');
    contactTitle.className = 'form-section-title';
    contactTitle.textContent = 'Contact Information';
    
    // Name row (first and last name)
    const nameRow = this.createNameRow();
    
    // Email input
    const emailInput = this.createEmailInput();
    
    // Phone input
    const phoneInput = this.createPhoneInput();
    
    // Submit button
    const submitButton = this.createSubmitButton();
    
    // Assemble form
    formContainer.appendChild(contactTitle);
    formContainer.appendChild(nameRow);
    formContainer.appendChild(emailInput);
    formContainer.appendChild(phoneInput);
    formContainer.appendChild(submitButton);
    
    return formContainer;
  },

  /**
   * Create name input row (first and last name)
   * @returns {HTMLElement} - Name row container
   */
  createNameRow() {
    const nameRow = document.createElement('div');
    nameRow.className = 'form-row';
    
    const firstNameInput = document.createElement('input');
    firstNameInput.type = 'text';
    firstNameInput.className = 'form-input';
    firstNameInput.id = 'firstName';
    firstNameInput.placeholder = 'First Name';
    firstNameInput.autocomplete = 'given-name';
    
    const lastNameInput = document.createElement('input');
    lastNameInput.type = 'text';
    lastNameInput.className = 'form-input';
    lastNameInput.id = 'lastName';
    lastNameInput.placeholder = 'Last Name';
    lastNameInput.autocomplete = 'family-name';
    
    nameRow.appendChild(firstNameInput);
    nameRow.appendChild(lastNameInput);
    
    return nameRow;
  },

  /**
   * Create email input
   * @returns {HTMLElement} - Email input
   */
  createEmailInput() {
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-input';
    emailInput.id = 'email';
    emailInput.placeholder = 'Email Address';
    emailInput.autocomplete = 'email';
    
    return emailInput;
  },

  /**
   * Create phone input
   * @returns {HTMLElement} - Phone input
   */
  createPhoneInput() {
    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.className = 'form-input';
    phoneInput.id = 'phone';
    phoneInput.placeholder = 'Phone Number';
    phoneInput.autocomplete = 'tel';
    
    // Add phone number formatting
    phoneInput.addEventListener('input', this.formatPhoneNumber);
    
    return phoneInput;
  },

  /**
   * Create submit button
   * @returns {HTMLElement} - Submit button
   */
  createSubmitButton() {
    const submitButton = document.createElement('button');
    submitButton.className = 'primary-button';
    submitButton.textContent = 'Complete Booking';
    submitButton.onclick = () => this.completeBooking();
    
    return submitButton;
  },

  /**
   * Format phone number as user types
   * @param {Event} event - Input event
   */
  formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    event.target.value = value;
  },

  /**
   * Validate and complete booking process
   */
  async completeBooking() {
    const formData = this.getFormData();
    
    // Clear previous errors
    this.clearFormErrors();
    
    // Validate form data
    const validationResult = this.validateFormData(formData);
    
    if (!validationResult.isValid) {
      return; // Stop if validation fails
    }
    
    // Show loading state
    const button = document.querySelector('.primary-button');
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;
    
    // Add user message with contact info
    MessageBubble.add('user', `${formData.firstName} ${formData.lastName} - ${formData.email}`);
    
    try {
      // Save client info to app state
      app.state.clientInfo = formData;
      
      // Update cart with client information
      await API.updateCartWithClientInfo(app.state.cartId, formData);
      
      // Proceed to confirmation step
      app.goToStep('confirmation');
      
    } catch (error) {
      console.error('Failed to update client info:', error);
      
      // Reset button state
      button.textContent = originalText;
      button.disabled = false;
      
      MessageBubble.showError('Unable to save your information. Please try again or contact us.');
    }
  },

  /**
   * Get form data from inputs
   * @returns {Object} - Form data object
   */
  getFormData() {
    return {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phoneNumber: document.getElementById('phone').value.trim()
    };
  },

  /**
   * Validate form data
   * @param {Object} formData - Form data to validate
   * @returns {Object} - Validation result with isValid boolean
   */
  validateFormData(formData) {
    let isValid = true;
    
    // Validate first name
    if (!Validation.validateField('firstName', formData.firstName, 'required')) {
      isValid = false;
    }
    
    // Validate last name
    if (!Validation.validateField('lastName', formData.lastName, 'required')) {
      isValid = false;
    }
    
    // Validate email
    if (!Validation.validateField('email', formData.email, 'email')) {
      isValid = false;
    }
    
    // Validate phone
    if (!Validation.validateField('phone', formData.phoneNumber, 'phone')) {
      isValid = false;
    }
    
    return { isValid };
  },

  /**
   * Clear all form validation errors
   */
  clearFormErrors() {
    document.querySelectorAll('.form-input').forEach(input => input.classList.remove('error'));
    document.querySelectorAll('.error-text').forEach(error => error.remove());
  }
};
