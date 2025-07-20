/**
 * Step 6: Show Services
 * Purpose: Load and display available services based on location and treatment type
 * Inputs: app.state.selectedLocation, app.state.treatmentType, optional app.state.selectedInjectorId
 * Outputs: selectedService/selectedServiceId saved to app.state, cart created, proceeds to calendar step
 * Integration: Called from provider-location step, calls calendar step
 */

const ServicesStep = {
  /**
   * Show available services for the selected location and treatment type
   */
  async show() {
    console.log('Step 6: Services Selection');
    
    try {
      // Create cart for the selected location
      const cart = await API.createCart(app.state.selectedLocationId);
      app.state.cartId = cart.id;
      
      // Load and filter services
      const services = this.loadServices(cart);
      app.state.availableServices = services;
      
      if (services.length > 0) {
        this.showServices(services);
      } else {
        this.showNoServicesFound();
      }
    } catch (error) {
      console.error('Failed to create cart:', error);
      MessageBubble.showError('Unable to create booking session. Please try again or contact us.');
      this.showSMSFallback();
    }
  },

  /**
   * Load and filter services from cart data
   * @param {Object} cart - Cart object from Boulevard API
   * @returns {Array} - Filtered array of available services
   */
  loadServices(cart) {
    const categories = cart.availableCategories || [];
    const services = [];
    
    for (const category of categories) {
      let categoryItems = category.availableItems || [];
      
      // Filter services based on treatment type
      if (app.state.treatmentType === 'injectable') {
        categoryItems = categoryItems.filter(item => 
          item.name.toLowerCase().includes('botox') ||
          item.name.toLowerCase().includes('filler') ||
          item.name.toLowerCase().includes('inject') ||
          item.name.toLowerCase().includes('dysport') ||
          category.name.toLowerCase().includes('inject')
        );
      } else if (app.state.treatmentType === 'skin') {
        categoryItems = categoryItems.filter(item => 
          item.name.toLowerCase().includes('laser') ||
          item.name.toLowerCase().includes('microneedling') ||
          item.name.toLowerCase().includes('facial') ||
          item.name.toLowerCase().includes('peel') ||
          category.name.toLowerCase().includes('skin')
        );
      }
      
      for (const item of categoryItems) {
        let staffVariants = item.staffVariants || [];
        
        // Filter to specific injector if selected
        if (app.state.selectedInjectorId && app.state.selectedInjectorId !== 'first-available') {
          staffVariants = staffVariants.filter(variant => 
            variant.staff && variant.staff.id === app.state.selectedInjectorId
          );
        }
        
        services.push({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.listPrice,
          duration: item.listDuration,
          category: category.name,
          staffVariants: staffVariants
        });
      }
    }
    
    return services;
  },

  /**
   * Display available services
   * @param {Array} services - Array of service objects
   */
  showServices(services) {
    const treatmentLabel = app.state.treatmentType === 'injectable' ? 'injectable treatments' : 'skin treatments';
    
    MessageBubble.add('system', `Here are the available ${treatmentLabel} at ${app.state.selectedLocation}:`, () => {
      const serviceElements = this.createServiceElements(services.slice(0, 10));
      
      const container = document.createElement('div');
      container.appendChild(serviceElements);
      
      const smsButton = MessageBubble.createSMSButton("Don't see what you're looking for? Contact us", 'service-inquiry');
      container.appendChild(smsButton);
      
      MessageBubble.add('system', container);
    });
  },

  /**
   * Create service selection elements
   * @param {Array} services - Array of service objects
   * @returns {HTMLElement} - Service grid container
   */
  createServiceElements(services) {
    const grid = document.createElement('div');
    grid.className = 'service-grid';
    
    services.forEach(service => {
      const button = document.createElement('button');
      button.className = 'service-button';
      button.onclick = () => this.selectService(service.id, service.name);
      
      const serviceInfo = document.createElement('div');
      serviceInfo.className = 'service-info';
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'service-name';
      nameDiv.textContent = service.name;
      
      const durationDiv = document.createElement('div');
      durationDiv.className = 'service-duration';
      durationDiv.textContent = Format.duration(service.duration);
      
      serviceInfo.appendChild(nameDiv);
      serviceInfo.appendChild(durationDiv);
      
      const priceDiv = document.createElement('div');
      priceDiv.className = 'service-price';
      priceDiv.textContent = Format.price(service.price);
      
      button.appendChild(serviceInfo);
      button.appendChild(priceDiv);
      grid.appendChild(button);
    });
    
    return grid;
  },

  /**
   * Handle service selection
   * @param {string} serviceId - Selected service ID
   * @param {string} serviceName - Selected service name
   */
  async selectService(serviceId, serviceName) {
    MessageBubble.add('user', serviceName);
    
    MessageBubble.add('system', `Great! I've added ${serviceName} to your booking. Now let me find available appointment times...`);
    
    try {
      // Add service to cart
      await this.addServiceToCart(serviceId);
      
      // Proceed to calendar
      app.goToStep('calendar', {
        selectedService: serviceName,
        selectedServiceId: serviceId
      });
    } catch (error) {
      console.error('Failed to add service:', error);
      MessageBubble.showError('Unable to add service. Please try again or contact us.');
    }
  },

  /**
   * Add selected service to cart
   * @param {string} serviceId - Service ID to add
   */
  async addServiceToCart(serviceId) {
    let staffVariantId = null;
    
    // Find staff variant if specific injector selected
    if (app.state.selectedInjectorId && app.state.selectedInjectorId !== 'first-available') {
      const selectedServiceData = app.state.availableServices.find(s => s.id === serviceId);
      if (selectedServiceData && selectedServiceData.staffVariants) {
        const staffVariant = selectedServiceData.staffVariants.find(v => 
          v.staff && v.staff.id === app.state.selectedInjectorId
        );
        if (staffVariant) {
          staffVariantId = staffVariant.id;
        }
      }
    }
    
    await API.addServiceToCart(app.state.cartId, serviceId, staffVariantId);
  },

  /**
   * Show message when no services are found
   */
  showNoServicesFound() {
    MessageBubble.add('system', CONFIG.TEXT.ERRORS.NO_SERVICES);
    this.showSMSFallback();
  },

  /**
   * Show SMS contact fallback
   */
  showSMSFallback() {
    const smsButton = MessageBubble.createSMSButton('Contact us for assistance', 'service-inquiry');
    MessageBubble.add('system', smsButton);
  }
};
