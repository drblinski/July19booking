/**
 * Step 9: Complete Booking
 * Purpose: Finalize booking with Boulevard API and show confirmation
 * Inputs: app.state with complete booking information
 * Outputs: Final booking confirmation or error handling
 * Integration: Called from user-info step, provides post-booking options
 */

const ConfirmationStep = {
  /**
   * Complete the booking and show confirmation
   */
  async show() {
    console.log('Step 9: Booking Confirmation');
    
    try {
      // Complete booking with Boulevard API
      const result = await API.completeBooking(app.state.cartId);
      
      // Show success confirmation
      this.showBookingSuccess(result);
      
    } catch (error) {
      console.error('Booking completion failed:', error);
      this.handleBookingError(error);
    }
  },

  /**
   * Display successful booking confirmation
   * @param {Object} result - Booking result from API
   */
  showBookingSuccess(result) {
    const successContent = this.createSuccessMessage(result);
    
    MessageBubble.showSuccess(successContent);
    
    // Show post-booking options after a delay
    setTimeout(() => {
      this.showPostBookingOptions();
    }, 2000);
  },

  /**
   * Create success message content
   * @param {Object} result - Booking result
   * @returns {string} - HTML success message
   */
  createSuccessMessage(result) {
    const injectorText = app.state.selectedInjector ? `Provider: ${app.state.selectedInjector}<br>` : '';
    const bookingIdText = result && result.bookingId ? `<br>Booking ID: ${result.bookingId}` : '';
    const appointmentIdText = result && result.appointmentId ? `<br>Appointment ID: ${result.appointmentId}` : '';
    
    return `<strong>✅ Booking Completed Successfully!</strong><br><br>` +
           `Location: ${app.state.selectedLocation}<br>` +
           `Service: ${app.state.selectedService}<br>` +
           `Date & Time: ${app.state.selectedTime.date} at ${app.state.selectedTime.time}<br>` +
           `${injectorText}` +
           `Client: ${app.state.clientInfo.firstName} ${app.state.clientInfo.lastName}<br>` +
           `${bookingIdText}${appointmentIdText}<br><br>` +
           `Your appointment has been confirmed and added to our calendar. You should receive a confirmation email shortly.`;
  },

  /**
   * Show post-booking options
   */
  showPostBookingOptions() {
    const optionsContainer = this.createPostBookingOptions();
    MessageBubble.add('system', optionsContainer);
  },

  /**
   * Create post-booking options container
   * @returns {HTMLElement} - Options container
   */
  createPostBookingOptions() {
    const container = document.createElement('div');
    
    const bookButton = document.createElement('button');
    bookButton.className = 'primary-button';
    bookButton.textContent = 'Book Another Appointment';
    bookButton.onclick = () => app.restart();
    
    const smsButton = MessageBubble.createSMSButton('Questions? Contact Us', 'follow-up');
    
    container.appendChild(bookButton);
    container.appendChild(smsButton);
    
    return container;
  },

  /**
   * Handle booking errors
   * @param {Error} error - Error object
   */
  handleBookingError(error) {
    const errorMessage = this.getErrorMessage(error);
    
    MessageBubble.showError(errorMessage);
    
    // Show fallback contact options
    setTimeout(() => {
      this.showErrorFallbackOptions();
    }, 2000);
  },

  /**
   * Get appropriate error message based on error type
   * @param {Error} error - Error object
   * @returns {string} - User-friendly error message
   */
  getErrorMessage(error) {
    const errorText = error.message.toLowerCase();
    
    if (errorText.includes('payment')) {
      return 'Payment is required to complete this booking. Please contact us to finalize your appointment.';
    } else if (errorText.includes('permission') || errorText.includes('unauthorized')) {
      return 'Unable to complete booking due to system permissions. Please contact us to complete your appointment.';
    } else if (errorText.includes('time') || errorText.includes('available')) {
      return 'The selected time is no longer available. Please choose a different time or contact us.';
    } else if (errorText.includes('graphql error')) {
      return `Booking system error. Please contact us to complete your appointment.`;
    } else {
      return 'We encountered an issue completing your booking. Please contact us and we\'ll be happy to help.';
    }
  },

  /**
   * Show error fallback options
   */
  showErrorFallbackOptions() {
    const container = document.createElement('div');
    
    const tryAgainButton = document.createElement('button');
    tryAgainButton.className = 'primary-button';
    tryAgainButton.textContent = 'Try Again';
    tryAgainButton.onclick = () => app.restart();
    
    const smsButton = MessageBubble.createSMSButton('Contact Us for Help', 'help');
    
    container.appendChild(tryAgainButton);
    container.appendChild(smsButton);
    
    MessageBubble.add('system', container);
  },

  /**
   * Show booking summary for review before final submission
   * @returns {HTMLElement} - Summary container
   */
  createBookingSummary() {
    const summary = document.createElement('div');
    summary.className = 'booking-summary';
    
    const summaryTitle = document.createElement('div');
    summaryTitle.className = 'form-section-title';
    summaryTitle.textContent = 'Booking Summary';
    
    const details = document.createElement('div');
    details.className = 'summary-details';
    
    const summaryItems = [
      { label: 'Location', value: app.state.selectedLocation },
      { label: 'Service', value: app.state.selectedService },
      { label: 'Date & Time', value: `${app.state.selectedTime.date} at ${app.state.selectedTime.time}` },
      { label: 'Provider', value: app.state.selectedInjector || 'First Available' },
      { label: 'Client', value: `${app.state.clientInfo.firstName} ${app.state.clientInfo.lastName}` },
      { label: 'Email', value: app.state.clientInfo.email },
      { label: 'Phone', value: Format.phone(app.state.clientInfo.phoneNumber) }
    ];
    
    summaryItems.forEach(item => {
      if (item.value && item.value !== 'undefined') {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
        details.appendChild(summaryItem);
      }
    });
    
    summary.appendChild(summaryTitle);
    summary.appendChild(details);
    
    return summary;
  }
};
