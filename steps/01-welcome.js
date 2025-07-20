/**
 * Step 1: Welcome / Intro Prompt
 * Purpose: Greet the user and explain the booking flow
 * Inputs: None
 * Outputs: Proceeds to client-type step
 * Integration: Entry point called by app.start()
 */

const WelcomeStep = {
  /**
   * Show welcome message and proceed to client type selection
   */
  show() {
    console.log('Step 1: Welcome - Starting booking flow');
    
    MessageBubble.add('system', CONFIG.TEXT.WELCOME_TITLE, () => {
      MessageBubble.add('system', CONFIG.TEXT.WELCOME_SUBTITLE, () => {
        // Proceed directly to client type selection
        app.goToStep('client-type');
      });
    });
  }
};
