/**
 * Step 4: Choose Booking Flow
 * Purpose: For injectable treatments, let user choose to book by injector or location
 * Inputs: app.state.treatmentType (must be 'injectable')
 * Outputs: bookingFlow saved to app.state, proceeds to provider-location step
 * Integration: Called conditionally from treatment-type step for injectables only
 */

const BookingFlowStep = {
  /**
   * Show booking flow selection for injectable treatments
   */
  show() {
    console.log('Step 4: Booking Flow Selection (Injectable)');
    
    if (app.state.treatmentType !== 'injectable') {
      console.error('Booking flow step called for non-injectable treatment');
      app.goToStep('provider-location');
      return;
    }
    
    this.showBookingFlowOptions();
  },

  /**
   * Display booking flow selection buttons
   */
  showBookingFlowOptions() {
    const options = [
      {
        text: CONFIG.TEXT.BOOKING_FLOWS.BY_INJECTOR,
        value: 'by-injector',
        description: 'Choose your preferred injector first',
        onclick: () => this.selectBookingFlow('by-injector', CONFIG.TEXT.BOOKING_FLOWS.BY_INJECTOR)
      },
      {
        text: CONFIG.TEXT.BOOKING_FLOWS.BY_LOCATION,
        value: 'by-location',
        description: 'Choose your preferred location first',
        onclick: () => this.selectBookingFlow('by-location', CONFIG.TEXT.BOOKING_FLOWS.BY_LOCATION)
      }
    ];

    const grid = MessageBubble.createButtonGrid(options, 'treatment-grid');
    
    const container = document.createElement('div');
    container.appendChild(grid);
    
    MessageBubble.add('system', container);
  },

  /**
   * Handle booking flow selection
   * @param {string} flow - Selected booking flow
   * @param {string} label - Display label for selection
   */
  selectBookingFlow(flow, label) {
    console.log('Selected booking flow:', flow);
    
    MessageBubble.add('user', label);
    
    if (flow === 'by-injector') {
      MessageBubble.add('system', 'Let me show you our available injectors...', () => {
        app.goToStep('provider-location', { bookingFlow: flow });
      });
    } else {
      MessageBubble.add('system', 'Please select your preferred location:', () => {
        app.goToStep('provider-location', { bookingFlow: flow });
      });
    }
  }
};
