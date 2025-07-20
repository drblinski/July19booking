/**
 * Configuration and Constants
 * Contains API endpoints, location data, and application constants
 * Configured to work with separate API service
 */

const CONFIG = {
  // Your API Configuration
  API: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api', // Your API base URL
    endpoints: {
      locations: '/locations',
      staff: '/staff',
      cart: '/cart',
      services: '/services',
      availability: '/availability',
      booking: '/booking'
    },
    timeout: 10000 // 10 second timeout
  },

  // Location data (can be fetched from your API or kept static)
  LOCATIONS: {
    'West Village': { 
      locationId: 'ffaaff3c-d5ba-408e-ba3b-455554b77116',
      address: '123 West Village St, New York, NY',
      phone: '(212) 555-0123'
    },
    'SoHo': { 
      locationId: '89763e68-2454-429c-ae9c-c1b4d91e7b81',
      address: '456 SoHo Ave, New York, NY',
      phone: '(212) 555-0124'
    },
    'Tribeca': { 
      locationId: '43dfb866-a872-4f01-9491-6c6584e3c3e7',
      address: '789 Tribeca Blvd, New York, NY',
      phone: '(212) 555-0125'
    },
    'Williamsburg': { 
      locationId: '93566b17-c023-4fe1-9a84-462f143bd024',
      address: '321 Williamsburg Way, Brooklyn, NY',
      phone: '(718) 555-0126'
    },
    'Hoboken': { 
      locationId: 'a885e859-21ef-43c7-8a63-bb242db98de2',
      address: '654 Hoboken St, Hoboken, NJ',
      phone: '(201) 555-0127'
    },
    'Uptown': { 
      locationId: 'b146c47b-6de8-475a-8ebd-8a1d2b36546d',
      address: '987 Uptown Ave, New York, NY',
      phone: '(212) 555-0128'
    },
    'Miami': { 
      locationId: '1cbb848e-138b-4142-bc3d-b9f4ea9a42db',
      address: '147 Miami Beach Dr, Miami, FL',
      phone: '(305) 555-0129'
    }
  },

  // UI Text and Labels (same as before)
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
