/**
 * Step 5: Select Provider or Location
 * Purpose: Show injectors or locations based on previous selections
 * Inputs: app.state.treatmentType, app.state.bookingFlow
 * Outputs: selectedInjector/selectedLocation saved to app.state, proceeds to services step
 * Integration: Called from booking-flow or treatment-type steps, calls services step
 */

const ProviderLocationStep = {
  /**
   * Show provider or location selection based on treatment type and booking flow
   */
  show() {
    console.log('Step 5: Provider/Location Selection');
    
    const { treatmentType, bookingFlow } = app.state;
    
    if (treatmentType === 'injector-availability') {
      this.loadInjectorsForAvailability();
    } else if (treatmentType === 'injectable' && bookingFlow === 'by-injector') {
      this.loadInjectorsForBooking();
    } else {
      this.showLocationSelection();
    }
  },

  /**
   * Load and display injectors for availability viewing
   */
  async loadInjectorsForAvailability() {
    try {
      MessageBubble.add('system', 'Loading our team of injectors...');
      
      const staff = await this.loadAllStaff();
      app.state.availableStaff = staff;
      
      this.assignLocationColors(staff);
      this.showInjectorsForAvailability();
    } catch (error) {
      console.error('Failed to load injectors for availability:', error);
      this.loadMockStaffForAvailability();
    }
  },

  /**
   * Load and display injectors for booking
   */
  async loadInjectorsForBooking() {
    try {
      MessageBubble.add('system', 'Loading our team of injectors...');
      
      const staff = await this.loadAllStaff();
      app.state.availableStaff = staff;
      
      this.showInjectorsForBooking();
    } catch (error) {
      console.error('Failed to load injectors for booking:', error);
      this.loadMockStaffForBooking();
    }
  },

  /**
   * Load staff from all locations
   * @returns {Promise<Array>} - Array of staff objects with location info
   */
  async loadAllStaff() {
    const locationEntries = Object.entries(CONFIG.LOCATIONS);
    const allStaffPromises = locationEntries.map(([locationName, locationData]) => 
      this.loadStaffFromLocation(locationName, locationData.locationId)
    );
    
    const responses = await Promise.all(allStaffPromises);
    
    // Aggregate staff from all locations
    const staffMap = new Map();
    
    responses.forEach(response => {
      if (!response || !response.cart) return;
      
      const { locationName, cart } = response;
      
      if (cart.availableCategories) {
        cart.availableCategories.forEach(category => {
          if (category.availableItems) {
            category.availableItems.forEach(item => {
              if (item.staffVariants && item.staffVariants.length > 0) {
                item.staffVariants.forEach(variant => {
                  if (variant.staff) {
                    if (!staffMap.has(variant.staff.id)) {
                      staffMap.set(variant.staff.id, {
                        id: variant.staff.id,
                        firstName: variant.staff.firstName,
                        lastName: variant.staff.lastName,
                        nickname: variant.staff.nickname,
                        avatar: variant.staff.avatar ? { url: variant.staff.avatar } : null,
                        locations: [locationName]
                      });
                    } else {
                      const staff = staffMap.get(variant.staff.id);
                      if (!staff.locations.includes(locationName)) {
                        staff.locations.push(locationName);
                      }
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
    
    return Array.from(staffMap.values());
  },

  /**
   * Load staff from a specific location
   * @param {string} locationName - Location name
   * @param {string} locationId - Boulevard location ID
   * @returns {Promise<Object>} - Location cart data
   */
  async loadStaffFromLocation(locationName, locationId) {
    try {
      const cart = await API.createCart(locationId);
      return { locationName, locationId, cart };
    } catch (error) {
      console.error(`Failed to load from location ${locationName}:`, error);
      return { locationName, locationId, cart: null };
    }
  },

  /**
   * Show injectors for availability viewing
   */
  showInjectorsForAvailability() {
    const options = app.state.availableStaff.map(staff => ({
      text: `${staff.firstName} ${staff.lastName}`,
      description: staff.locations.join(', '),
      onclick: () => this.selectInjectorForAvailability(staff)
    }));

    const grid = MessageBubble.createButtonGrid(options, 'injector-list');
    
    const container = document.createElement('div');
    container.appendChild(grid);
    
    MessageBubble.add('system', 'Select an injector to view their availability across all locations:');
    MessageBubble.add('system', container);
  },

  /**
   * Show injectors for booking
   */
  showInjectorsForBooking() {
    const firstAvailableOption = {
      text: 'First Available',
      description: 'Book with the next available injector',
      onclick: () => this.selectInjector('first-available', 'First Available')
    };

    const injectorOptions = app.state.availableStaff.map(staff => ({
      text: `${staff.firstName} ${staff.lastName}`,
      description: staff.locations.join(', '),
      onclick: () => this.selectInjector(staff.id, `${staff.firstName} ${staff.lastName}`)
    }));

    const allOptions = [firstAvailableOption, ...injectorOptions];
    const grid = MessageBubble.createButtonGrid(allOptions, 'injector-list');
    
    const container = document.createElement('div');
    container.appendChild(grid);
    
    const smsButton = MessageBubble.createSMSButton("Don't see your preferred injector? Contact us", 'injector-inquiry');
    container.appendChild(smsButton);
    
    MessageBubble.add('system', container);
  },

  /**
   * Show location selection
   */
  showLocationSelection() {
    const availableLocations = this.getAvailableLocations();
    
    const options = availableLocations.map(locationName => ({
      text: locationName,
      onclick: () => this.selectLocation(locationName)
    }));

    const grid = MessageBubble.createButtonGrid(options, 'location-grid');
    
    const container = document.createElement('div');
    container.appendChild(grid);
    
    MessageBubble.add('system', container);
  },

  /**
   * Get available locations based on current selections
   * @returns {Array<string>} - Array of location names
   */
  getAvailableLocations() {
    let availableLocations = Object.keys(CONFIG.LOCATIONS);
    
    // If a specific injector is selected, only show their locations
    if (app.state.selectedInjectorId && app.state.selectedInjectorId !== 'first-available') {
      const selectedStaff = app.state.availableStaff.find(s => s.id === app.state.selectedInjectorId);
      if (selectedStaff && selectedStaff.locations) {
        availableLocations = selectedStaff.locations;
      }
    }
    
    return availableLocations;
  },

  /**
   * Handle injector selection for availability viewing
   * @param {Object} staff - Selected staff object
   */
  selectInjectorForAvailability(staff) {
    const fullName = `${staff.firstName} ${staff.lastName}`;
    MessageBubble.add('user', fullName);
    
    app.goToStep('calendar', {
      selectedInjector: fullName,
      selectedInjectorId: staff.id,
      injectorLocations: staff.locations,
      isAvailabilityView: true
    });
  },

  /**
   * Handle injector selection for booking
   * @param {string} injectorId - Selected injector ID
   * @param {string} injectorName - Selected injector name
   */
  selectInjector(injectorId, injectorName) {
    MessageBubble.add('user', injectorName);
    
    MessageBubble.add('system', 'Perfect! Now please select your preferred location:', () => {
      app.goToStep('provider-location', {
        selectedInjector: injectorName,
        selectedInjectorId: injectorId,
        showLocationSelection: true
      });
    });
  },

  /**
   * Handle location selection
   * @param {string} location - Selected location name
   */
  selectLocation(location) {
    MessageBubble.add('user', location);
    
    MessageBubble.add('system', `Perfect! Creating your booking session for ${location}...`);
    
    app.goToStep('services', {
      selectedLocation: location,
      selectedLocationId: CONFIG.LOCATIONS[location].locationId
    });
  },

  /**
   * Assign colors to locations for availability view
   * @param {Array} staffList - List of staff with locations
   */
  assignLocationColors(staffList) {
    const allLocations = new Set();
    staffList.forEach(staff => {
      staff.locations.forEach(location => allLocations.add(location));
    });
    
    const locationArray = Array.from(allLocations);
    app.state.locationColors = {};
    
    locationArray.forEach((location, index) => {
      app.state.locationColors[location] = CONFIG.LOCATION_COLORS[index % CONFIG.LOCATION_COLORS.length];
    });
  },

  /**
   * Load mock staff data for availability (fallback)
   */
  loadMockStaffForAvailability() {
    const mockStaff = [
      { id: 'staff1', firstName: 'Sarah', lastName: 'Johnson', locations: ['West Village', 'SoHo'] },
      { id: 'staff2', firstName: 'Michael', lastName: 'Chen', locations: ['Tribeca', 'Williamsburg'] },
      { id: 'staff3', firstName: 'Emily', lastName: 'Rodriguez', locations: ['Hoboken', 'Uptown'] },
      { id: 'staff4', firstName: 'David', lastName: 'Thompson', locations: ['Miami', 'West Village'] },
      { id: 'staff5', firstName: 'Jessica', lastName: 'Martinez', locations: ['SoHo', 'Tribeca'] }
    ];
    
    app.state.availableStaff = mockStaff;
    this.assignLocationColors(mockStaff);
    this.showInjectorsForAvailability();
  },

  /**
   * Load mock staff data for booking (fallback)
   */
  loadMockStaffForBooking() {
    const mockStaff = [
      { id: 'staff1', firstName: 'Sarah', lastName: 'Johnson', locations: ['West Village', 'SoHo'] },
      { id: 'staff2', firstName: 'Michael', lastName: 'Chen', locations: ['Tribeca', 'Williamsburg'] },
      { id: 'staff3', firstName: 'Emily', lastName: 'Rodriguez', locations: ['Hoboken', 'Uptown'] }
    ];
    
    app.state.availableStaff = mockStaff;
    this.showInjectorsForBooking();
  }
};
