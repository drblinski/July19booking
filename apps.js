/**
 * Main Application Controller
 * Manages global state and coordinates all booking steps
 * Provides centralized state management and step navigation
 */

const app = {
  // Global application state
  state: {
    currentStep: 'welcome',
    clientType: null,           // 'new', 'returning', 'member'
    treatmentType: null,        // 'injectable', 'skin', 'injector-availability'
    bookingFlow: null,          // 'by-injector', 'by-location'
    selectedLocation: null,
    selectedLocationId: null,
    selectedInjector: null,
    selectedInjectorId: null,
    selectedService: null,
    selectedServiceId: null,
    selectedTime: null,
    cartId: null,
    clientInfo: {},
    availableStaff: [],
    availableServices: [],
    calendarAvailability: {},
    currentCalendarDate: new Date(),
    selectedDate: null,
    injectorLocations: [],
    locationColors: {},
    visibleLocations: new Set(),
    injectorAvailabilityData: {}
  },

  // Initialize the application
  init() {
    console.log('Initializing Get Plump booking app...');
    this.start();
  },

  // Start or restart the booking flow
  start() {
    this.clearMessages();
    this.resetState();
    WelcomeStep.show();
  },

  // Restart the entire flow
  restart() {
    this.start();
  },

  // Reset application state
  resetState() {
    this.state = {
      ...this.state,
      currentStep: 'welcome',
      clientType: null,
      treatmentType: null,
      bookingFlow: null,
      selectedLocation: null,
      selectedLocationId: null,
      selectedInjector: null,
      selectedInjectorId: null,
      selectedService: null,
      selectedServiceId: null,
      selectedTime: null,
      cartId: null,
      clientInfo: {},
      availableStaff: [],
      availableServices: [],
      calendarAvailability: {},
      currentCalendarDate: new Date(),
      selectedDate: null,
      injectorLocations: [],
      locationColors: {},
      visibleLocations: new Set(),
      injectorAvailabilityData: {}
    };
  },

  // Clear all messages from the UI
  clearMessages() {
    const container = document.getElementById('messages');
    container.innerHTML = '';
  },

  // Navigate to the next step in the flow
  goToStep(stepName, data = {}) {
    console.log(`Navigating to step: ${stepName}`, data);
    
    // Update state with any provided data
    Object.assign(this.state, data);
    this.state.currentStep = stepName;

    // Route to the appropriate step
    switch(stepName) {
      case 'welcome':
        WelcomeStep.show();
        break;
      case 'client-type':
        ClientTypeStep.show();
        break;
      case 'treatment-type':
        TreatmentTypeStep.show();
        break;
      case 'booking-flow':
        BookingFlowStep.show();
        break;
      case 'provider-location':
        ProviderLocationStep.show();
        break;
      case 'services':
        ServicesStep.show();
        break;
      case 'calendar':
        CalendarStep.show();
        break;
      case 'user-info':
        UserInfoStep.show();
        break;
      case 'confirmation':
        ConfirmationStep.show();
        break;
      default:
        console.error('Unknown step:', stepName);
    }
  },

  // Handle SMS fallbacks
  openSMS(context) {
    let message = "I'd like to book an appointment at Get Plump";
    
    const contextMessages = {
      'follow-up': "I just completed a booking and have a question",
      'injector-inquiry': "I'm looking for a specific injector that wasn't listed",
      'service-inquiry': `I'm looking for services at ${this.state.selectedLocation} but need different options`,
      'time-inquiry': `I'm looking for ${this.state.selectedService} at ${this.state.selectedLocation} but need different time options`,
      'help': "I need help with booking"
    };

    if (contextMessages[context]) {
      message = contextMessages[context];
    }

    message += ".";
    
    const encodedMessage = encodeURIComponent(message);
    window.location.href = 'sms:+16463468809?body=' + encodedMessage;
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
