/**
 * Step 2: Select Client Type
 * Purpose: Determine if user is new, returning, or member client
 * Inputs: None
 * Outputs: clientType saved to app.state, proceeds to treatment-type step
 * Integration: Called from welcome step, calls treatment-type step
 */

const ClientTypeStep = {
  /**
   * Show client type selection options
   */
  show() {
    console.log('Step 2: Client Type Selection');
    
    MessageBubble.add('system', 'Are you a new client or have you visited us before?', () => {
      this.showClientTypeOptions();
    });
  },

  /**
   * Display client type selection buttons
   */
  showClientTypeOptions() {
    const options = [
      {
        text: CONFIG.TEXT.CLIENT_TYPES.NEW,
        value: 'new',
        description: 'First time at Get Plump',
        onclick: () => this.selectClientType('new', CONFIG.TEXT.CLIENT_TYPES.NEW)
      },
      {
        text: CONFIG.TEXT.CLIENT_TYPES.RETURNING,
        value: 'returning', 
        description: 'I\'ve been here before',
        onclick: () => this.selectClientType('returning', CONFIG.TEXT.CLIENT_TYPES.RETURNING)
      },
      {
        text: CONFIG.TEXT.CLIENT_TYPES.MEMBER,
        value: 'member',
        description: 'I have a membership',
        onclick: () => this.selectClientType('member', CONFIG.TEXT.CLIENT_TYPES.MEMBER)
      }
    ];

    const grid = MessageBubble.createButtonGrid(options, 'treatment-grid');
    
    const container = document.createElement('div');
    container.appendChild(grid);
    
    MessageBubble.add('system', container);
  },

  /**
   * Handle client type selection
   * @param {string} type - Selected client type
   * @param {string} label - Display label for selection
   */
  selectClientType(type, label) {
    console.log('Selected client type:', type);
    
    MessageBubble.add('user', label);
    
    // Save selection and proceed to treatment type
    app.goToStep('treatment-type', { 
      clientType: type 
    });
  }
};
