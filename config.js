/**
 * Configuration and Constants
 * Fixed browser compatibility - removed process.env reference
 */

const CONFIG = {
  // Your API Configuration - Fixed for browser environment
  API: {
    baseUrl: window.ENV?.API_BASE_URL || '/api', // Fixed: removed process.env
    endpoints: {
      locations: '/locations',
      staff: '/staff',
      cart: '/cart',
      services: '/services',
      availability: '/availability',
      booking: '/booking'
    },
    timeout: 10000
  },

  // Location data
  LOCATIONS: {
    'West Village': { 
      locationId: 'ffaaff3c-d5ba-408e-ba3b-455554b77116'
    },
    'SoHo': { 
      locationId: '89763e68-2454-429c-ae9c-c1b4d91e7b81'
    },
    'Tribeca': { 
      locationId: '43dfb866-a872-4f01-9491-6c6584e3c3e7'
    },
    'Williamsburg': { 
      locationId: '93566b17-c023-4fe1-9a84-462f143bd024'
    },
    'Hoboken': { 
      locationId: 'a885e859-21ef-43c7-8a63-bb242db98de2'
    },
    'Uptown': { 
      locationId: 'b146c47b-6de8-475a-8ebd-8a1d2b36546d'
    },
    'Miami': { 
      locationId: '1cbb848e-138b-4142-bc3d-b9f4ea9a42db'
    }
  },

  // UI Text and Labels
  TEXT: {
    WELCOME_TITLE: "Hi! Welcome to Get Plump.",
    WELCOME_SUBTITLE: "I'll help you book your appointment.",
    CLIENT_TYPES: {
      NEW: "New Client",
      RETURNING: "Returning Client", 
      MEMBER: "Member"
    },
    TREATMENT_TYPES: {
      INJECTABLE: "Injectable Treatments",
      SKIN: "Skin Treatments",
      INJECTOR_AVAILABILITY: "See a Specific Injector's Availability"
    },
    BOOKING_FLOWS: {
      BY_INJECTOR: "Book by Injector",
      BY_LOCATION: "Book by Location"
    },
    ERRORS: {
      GENERIC: "Something went wrong. Please try again or contact us.",
      NO_SERVICES: "No services found for your selection.",
      NO_AVAILABILITY: "No availability found for the selected date.",
      INVALID_EMAIL: "Please enter a valid email address.",
      INVALID_PHONE: "Please enter a valid phone number.",
      REQUIRED_FIELD: "This field is required.",
      API_ERROR: "Unable to connect to booking system. Please try again.",
      NETWORK_ERROR: "Network error. Please check your connection."
    }
  },

  // Color palette for location indicators
  LOCATION_COLORS: ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', '#AF52DE', '#FF2D92', '#64D2FF']
};

console.log('✅ Config loaded successfully');
