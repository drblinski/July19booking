# Get Plump Booking API Contract

This document describes the expected API endpoints and data formats for the booking widget to communicate with your backend service.

## Base URL
Configure in `config.js`: `CONFIG.API.baseUrl`

## Authentication
Include any authentication headers your API requires in the `utils/api.js` file.

## Endpoints

### GET /api/locations
Get all available locations.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ffaaff3c-d5ba-408e-ba3b-455554b77116",
      "name": "West Village",
      "address": "123 West Village St, New York, NY",
      "phone": "(212) 555-0123",
      "timezone": "America/New_York"
    }
  ]
}
