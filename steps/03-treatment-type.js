/**
 * Step 3: Select Treatment Type
 * Purpose: Determine what type of treatment the user wants
 * Inputs: app.state.clientType
 * Outputs: treatmentType saved to app.state, proceeds to booking-flow or provider-location
 * Integration: Called from client-type step, conditionally calls booking-flow or provider-location
 */

const TreatmentTypeStep = {
  /**
   * Show treatment type selection based on client type
   */
  show() {
    console.log('Step 3: Treatment Type Selection');
    
    const clientType = app.state.clientType;
    const greeting = this.getGreetingForClientType(clientType);
    
    MessageBubble.add('system', `${greeting} What type of treatment are you interested in?`, () => {
      this.showTreatmentTypeOptions();
    });
  },

  /**
   * Get appropriate greeting based on client type
   * @param {string} clientType - The selected client type
   * @returns {string} - Personalized greeting
   */
  getGreetingForClientType(clientType) {
    switch(clientType) {
      case 'new':
        return 'Welcome to Get Plump!';
      case 'returning':
        return 'Welcome back!';
      case 'member':
        return 'Hello, valued member!';
      default:
        return 'Great!';
    }
  },

  /**
   * Display treatment type selection buttons
   */
  showTreatmentTypeOptions() {
    const options = [
      {
        text: CONFIG.TEXT.TREATMENT_TYPES.INJECTABLE,
        value: 'injectable',
        description: 'Botox, fillers, and other injectable services',
        onclick: () => this.selectTreatmentType('injectable', CONFIG.TEXT.TREATMENT_TYPES.INJECTABLE)
      },
      {
        text: CONFIG.TEXT.TREATMENT_TYPES.SKIN,
        value: 'skin',
        description: 'Laser, microneedling, and skincare services',
        onclick: () => this.selectTreatmentType('skin', CONFIG.TEXT.TREATMENT_TYPES.SKIN)
      },
      {
        text: CONFIG.TEXT.TREATMENT_TYPES.INJECTOR_AVAILABILITY,
        value: 'injector-availability',
        description: 'View open slots for your preferred injector across all locations',
        onclick: () => this.selectTreatmentType('injector-availability', CONFIG.TEXT.TREATMENT_TYPES.INJECTOR_AVAILABILITY)
      }
    ];

    const grid = MessageBubble.createButtonGrid(options, 'treatment-grid');
    grid.style.gridTemplateColumns = '1fr'; // Stack vertically for 3 options
    
    const container = document.createElement('div');
    container.appendChild(grid);
    
    MessageBubble.add('system', container);
  },

  /**
   * Handle treatment type selection
   * @param {string} type - Selected treatment type
   * @param {string} label - Display label for selection
   */
  selectTreatmentType(type, label) {
    console.log('Selected treatment type:', type);
    
    MessageBubble.add('user', label);
    
    // Route to appropriate next step based on treatment type
    if (type === 'injectable') {
      MessageBubble.add('system', 'Great! For injectable treatments, would you like to book with a specific injector or choose a location first?', () => {
        app.goToStep('booking-flow', { treatmentType: type });
      });
    } else if (type === 'skin') {
      MessageBubble.add('system', 'Perfect! Please select your preferred location:', () => {
        app.goToStep('provider-location', { treatmentType: type });
      });
    } else if (type === 'injector-availability') {
      MessageBubble.add('system', 'Perfect! Let me load our team of injectors and their availability...', () => {
        app.goToStep('provider-location', { treatmentType: type });
      });
    }
  }
};
