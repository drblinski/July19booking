/**
 * Step 7: Show Calendar / Pick Time
 * Purpose: Display calendar interface for date/time selection
 * Inputs: app.state.cartId, app.state.selectedService, optional app.state.isAvailabilityView
 * Outputs: selectedTime/selectedDate saved to app.state, time slot reserved, proceeds to user-info step
 * Integration: Called from services step, calls user-info step
 */

const CalendarStep = {
  /**
   * Show calendar interface based on booking type
   */
  show() {
    console.log('Step 7: Calendar/Time Selection');
    
    if (app.state.isAvailabilityView) {
      this.showInjectorAvailabilityFlow();
    } else {
      this.showRegularCalendarFlow();
    }
  },

  /**
   * Show regular calendar flow for booking
   */
  showRegularCalendarFlow() {
    MessageBubble.add('system', 'Here are the available appointment times:', () => {
      this.showCalendarView();
      this.loadAvailabilityForMonth();
    });
  },

  /**
   * Show injector availability flow
   */
  async showInjectorAvailabilityFlow() {
    MessageBubble.add('system', `Perfect! Loading ${app.state.selectedInjector}'s availability across all locations...`, () => {
      this.loadInjectorAvailabilityAcrossLocations();
    });
  },

  /**
   * Create and display calendar view
   */
  showCalendarView() {
    const calendarContainer = this.createCalendarContainer();
    
    const container = document.createElement('div');
    container.appendChild(calendarContainer);
    
    const smsButton = MessageBubble.createSMSButton("Don't see a good time? Contact us", 'time-inquiry');
    container.appendChild(smsButton);
    
    MessageBubble.add('system', container);
    
    this.renderCalendar();
  },

  /**
   * Create calendar container structure
   * @returns {HTMLElement} - Calendar container
   */
  createCalendarContainer() {
    const availabilityContainer = document.createElement('div');
    availabilityContainer.className = 'availability-container';
    availabilityContainer.id = 'availability-container';
    
    return availabilityContainer;
  },

  /**
   * Render calendar grid and navigation
   */
  renderCalendar() {
    const container = document.getElementById('availability-container');
    container.innerHTML = '';
    
    // Calendar header with navigation
    const calendarHeader = this.createCalendarHeader();
    
    // Calendar grid
    const calendarGrid = this.createCalendarGrid();
    
    // Time slots container (initially hidden)
    const timeSlotsContainer = this.createTimeSlotsContainer();
    
    container.appendChild(calendarHeader);
    container.appendChild(calendarGrid);
    container.appendChild(timeSlotsContainer);
  },

  /**
   * Create calendar header with navigation
   * @returns {HTMLElement} - Calendar header
   */
  createCalendarHeader() {
    const calendarHeader = document.createElement('div');
    calendarHeader.className = 'calendar-header';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'calendar-nav';
    prevButton.textContent = '← Previous';
    prevButton.onclick = () => this.navigateMonth(-1);
    
    const calendarTitle = document.createElement('div');
    calendarTitle.className = 'calendar-title';
    calendarTitle.textContent = app.state.currentCalendarDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    const nextButton = document.createElement('button');
    nextButton.className = 'calendar-nav';
    nextButton.textContent = 'Next →';
    nextButton.onclick = () => this.navigateMonth(1);
    
    calendarHeader.appendChild(prevButton);
    calendarHeader.appendChild(calendarTitle);
    calendarHeader.appendChild(nextButton);
    
    return calendarHeader;
  },

  /**
   * Create calendar grid with days
   * @returns {HTMLElement} - Calendar grid
   */
  createCalendarGrid() {
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'calendar-day-header';
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });
    
    // Generate calendar days
    const year = app.state.currentCalendarDate.getFullYear();
    const month = app.state.currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day disabled';
      calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dayElement = this.createCalendarDay(date, today);
      calendarGrid.appendChild(dayElement);
    }
    
    return calendarGrid;
  },

  /**
   * Create individual calendar day element
   * @param {Date} date - Date for this day
   * @param {Date} today - Today's date for comparison
   * @returns {HTMLElement} - Day element
   */
  createCalendarDay(date, today) {
    const dateStr = Format.apiDate(date);
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    // Check if day is in the past
    if (date < today) {
      dayElement.classList.add('disabled');
    } else {
      dayElement.onclick = () => this.selectCalendarDate(date);
      
      // Check if this day has availability
      if (app.state.calendarAvailability[dateStr] && app.state.calendarAvailability[dateStr].length > 0) {
        dayElement.classList.add('has-availability');
      }
    }
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    
    const dayAvailability = document.createElement('div');
    dayAvailability.className = 'day-availability';
    if (app.state.calendarAvailability[dateStr] && app.state.calendarAvailability[dateStr].length > 0) {
      dayAvailability.textContent = `${app.state.calendarAvailability[dateStr].length} slots`;
    }
    
    dayElement.appendChild(dayNumber);
    dayElement.appendChild(dayAvailability);
    
    return dayElement;
  },

  /**
   * Create time slots container
   * @returns {HTMLElement} - Time slots container
   */
  createTimeSlotsContainer() {
    const timeSlotsContainer = document.createElement('div');
    timeSlotsContainer.className = 'time-slots';
    timeSlotsContainer.id = 'time-slots-container';
    timeSlotsContainer.style.display = 'none';
    
    return timeSlotsContainer;
  },

  /**
   * Navigate calendar month
   * @param {number} direction - Direction to navigate (-1 for previous, 1 for next)
   */
  navigateMonth(direction) {
    app.state.currentCalendarDate.setMonth(app.state.currentCalendarDate.getMonth() + direction);
    this.renderCalendar();
    this.loadAvailabilityForMonth();
  },

  /**
   * Load availability for the current month
   */
  async loadAvailabilityForMonth() {
    const year = app.state.currentCalendarDate.getFullYear();
    const month = app.state.currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Load availability for all days in the month
    const promises = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      if (date >= new Date()) { // Only load for future dates
        promises.push(this.loadAvailabilityForDate(date));
      }
    }
    
    try {
      await Promise.all(promises);
      this.renderCalendar(); // Re-render with availability data
    } catch (error) {
      console.error('Failed to load availability:', error);
    }
  },

  /**
   * Load availability for a specific date
   * @param {Date} date - Date to load availability for
   * @returns {Promise<Array>} - Available times
   */
  async loadAvailabilityForDate(date) {
    const dateStr = Format.apiDate(date);
    
    try {
      const times = await API.getAvailableTimes(app.state.cartId, date);
      app.state.calendarAvailability[dateStr] = times;
      return times;
    } catch (error) {
      console.error('Failed to load availability for', dateStr, error);
      app.state.calendarAvailability[dateStr] = [];
      return [];
    }
  },

  /**
   * Handle calendar date selection
   * @param {Date} date - Selected date
   */
  selectCalendarDate(date) {
    app.state.selectedDate = date;
    const dateStr = Format.apiDate(date);
    
    // Update selected state in calendar
    document.querySelectorAll('.calendar-day').forEach(day => {
      day.classList.remove('selected');
    });
    
    // Find and select the clicked day
    const dayElements = document.querySelectorAll('.calendar-day');
    dayElements.forEach(dayElement => {
      const dayNumber = dayElement.querySelector('.day-number');
      if (dayNumber && parseInt(dayNumber.textContent) === date.getDate()) {
        dayElement.classList.add('selected');
      }
    });
    
    // Show time slots for this date
    this.showTimeSlotsForDate(date);
  },

  /**
   * Show available time slots for selected date
   * @param {Date} date - Selected date
   */
  showTimeSlotsForDate(date) {
    const dateStr = Format.apiDate(date);
    const times = app.state.calendarAvailability[dateStr] || [];
    
    const timeSlotsContainer = document.getElementById('time-slots-container');
    timeSlotsContainer.innerHTML = '';
    
    if (times.length === 0) {
      timeSlotsContainer.innerHTML = '<p style="text-align: center; color: #86868b; padding: 20px;">No available times for this date</p>';
    } else {
      times.forEach(time => {
        const timeSlot = this.createTimeSlot(time, date);
        timeSlotsContainer.appendChild(timeSlot);
      });
    }
    
    timeSlotsContainer.style.display = 'block';
    MessageBubble.scrollToBottom();
  },

  /**
   * Create time slot element
   * @param {Object} time - Time slot object
   * @param {Date} date - Selected date
   * @returns {HTMLElement} - Time slot element
   */
  createTimeSlot(time, date) {
    const timeStr = Format.time(time.startTime);
    const dateStr = Format.calendarDate(date);
    
    const timeSlot = document.createElement('div');
    timeSlot.className = 'time-slot';
    timeSlot.textContent = timeStr;
    timeSlot.onclick = () => this.selectTime(time.id, timeStr, dateStr, time.startTime);
    
    return timeSlot;
  },

  /**
   * Handle time slot selection
   * @param {string} timeId - Time slot ID
   * @param {string} timeStr - Formatted time string
   * @param {string} dateStr - Formatted date string
   * @param {string} startTime - ISO start time
   */
  async selectTime(timeId, timeStr, dateStr, startTime) {
    app.state.selectedTime = { id: timeId, time: timeStr, date: dateStr, startTime: startTime };
    
    MessageBubble.add('user', `${dateStr} at ${timeStr}`);
    MessageBubble.add('system', `Perfect! I've noted your preferred time: ${dateStr} at ${timeStr}. Let me reserve this time slot...`);
    
    try {
      // Reserve the time slot
      await API.reserveTimeSlot(app.state.cartId, timeId);
      
      MessageBubble.add('system', `Great! I've reserved your time slot. Now I need your contact information to complete your booking...`);
      
      // Proceed to user info step
      app.goToStep('user-info');
    } catch (error) {
      console.error('Failed to reserve time slot:', error);
      MessageBubble.add('system', `I'm sorry, that time slot is no longer available. Please choose a different time.`);
      MessageBubble.showError('Time slot is no longer available. Please select a different time.');
    }
  },

  /**
   * Load injector availability across all locations
   */
  async loadInjectorAvailabilityAcrossLocations() {
    try {
      const promises = app.state.injectorLocations.map(locationName => 
        this.loadInjectorAvailabilityForLocation(locationName)
      );
      
      await Promise.all(promises);
      this.showInjectorAvailabilityCalendar();
    } catch (error) {
      console.error('Failed to load injector availability:', error);
      MessageBubble.showError('Unable to load availability. Please try again or contact us.');
    }
  },

  /**
   * Load availability for injector at specific location
   * @param {string} locationName - Location name
   */
  async loadInjectorAvailabilityForLocation(locationName) {
    // Implementation for injector availability would go here
    // This is a simplified version - full implementation would involve creating carts for each location
    console.log(`Loading availability for ${app.state.selectedInjector} at ${locationName}`);
  },

  /**
   * Show injector availability calendar
   */
  showInjectorAvailabilityCalendar() {
    // Implementation for injector availability calendar would go here
    MessageBubble.add('system', `Showing ${app.state.selectedInjector}'s availability across all locations...`);
    
    // For now, show regular calendar as fallback
    this.showCalendarView();
  }
};
