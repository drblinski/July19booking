/**
 * Message Bubble Components
 * Reusable UI components for displaying messages, typing indicators, and interactive elements
 * Provides consistent message styling and behavior across all steps
 */

const MessageBubble = {
  /**
   * Add a message to the chat interface
   * @param {string} type - Message type ('system' or 'user')
   * @param {string|HTMLElement} content - Message content
   * @param {Function} callback - Optional callback after message is displayed
   */
  add(type, content, callback) {
    const container = document.getElementById('messages');
    
    if (type === 'system') {
      this.showTyping(() => {
        const message = document.createElement('div');
        message.className = 'message ' + type;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (typeof content === 'string') {
          bubble.innerHTML = content;
        } else {
          bubble.appendChild(content);
        }
        
        message.appendChild(bubble);
        container.appendChild(message);
        this.scrollToBottom();
        
        if (callback) {
          setTimeout(callback, 500);
        }
      });
    } else {
      const message = document.createElement('div');
      message.className = 'message ' + type;
      
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      bubble.textContent = content;
      
      message.appendChild(bubble);
      container.appendChild(message);
      this.scrollToBottom();
      
      if (callback) {
        setTimeout(callback, 300);
      }
    }
  },

  /**
   * Show typing indicator before system message
   * @param {Function} callback - Function to call after typing animation
   */
  showTyping(callback) {
    const container = document.getElementById('messages');
    const typingMessage = document.createElement('div');
    typingMessage.className = 'message system';
    typingMessage.id = 'typing-indicator';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    
    const typingDots = document.createElement('div');
    typingDots.className = 'typing-dots';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      typingDots.appendChild(dot);
    }
    
    typingIndicator.appendChild(typingDots);
    typingMessage.appendChild(typingIndicator);
    container.appendChild(typingMessage);
    this.scrollToBottom();
    
    setTimeout(() => {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) {
        indicator.remove();
      }
      callback();
    }, 1200);
  },

  /**
   * Create a grid of buttons for selection
   * @param {Array} options - Array of {text, value, description?, onclick} objects
   * @param {string} gridClass - CSS class for the grid container
   * @returns {HTMLElement} - Grid container element
   */
  createButtonGrid(options, gridClass = 'selection-grid') {
    const grid = document.createElement('div');
    grid.className = gridClass;
    
    options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'selection-button';
      button.onclick = option.onclick;
      
      const title = document.createElement('div');
      title.className = 'selection-title';
      title.textContent = option.text;
      
      button.appendChild(title);
      
      if (option.description) {
        const desc = document.createElement('div');
        desc.className = 'selection-desc';
        desc.textContent = option.description;
        button.appendChild(desc);
      }
      
      grid.appendChild(button);
    });
    
    return grid;
  },

  /**
   * Create an SMS contact button
   * @param {string} text - Button text
   * @param {string} context - SMS context for message customization
   * @returns {HTMLElement} - SMS button element
   */
  createSMSButton(text, context) {
    const button = document.createElement('button');
    button.className = 'secondary-button';
    button.textContent = text;
    button.onclick = () => app.openSMS(context);
    return button;
  },

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    const container = document.getElementById('messages');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'message system';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = `<div class="error-message">${message}</div>`;
    
    errorMessage.appendChild(bubble);
    container.appendChild(errorMessage);
    this.scrollToBottom();
  },

  /**
   * Show success message
   * @param {string} message - Success message to display
   */
  showSuccess(message) {
    const container = document.getElementById('messages');
    const successMessage = document.createElement('div');
    successMessage.className = 'message system';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = `<div class="success-message">${message}</div>`;
    
    successMessage.appendChild(bubble);
    container.appendChild(successMessage);
    this.scrollToBottom();
  },

  /**
   * Scroll messages container to bottom
   */
  scrollToBottom() {
    const container = document.getElementById('messages');
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
  }
};
