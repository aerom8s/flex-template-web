/*
 * Marketplace specific configuration.
 */

export const amenities = [
  {
    key: 'night_operational',
    label: 'Night Operational',
  },
  {
    key: 'instrument_operational',
    label: 'Instrument Operational',
  },
  {
    key: 'pet_friendly',
    label: 'Pet Friendly',
  },
  {
    key: 'catering_available',
    label: 'Catering Available',
  },
  {
    key: 'bathroom_available',
    label: 'Bathroom Available',
  },
  {
    key: 'wifi_onboard',
    label: 'WIFI Onboard',
  },
  {
    key: 'usb_charging',
    label: 'USB Charging',
  },
];

export const categories = [
  { key: 'smoke', label: 'Smoke' },
  { key: 'electric', label: 'Electric' },
  { key: 'wood', label: 'Wood' },
  { key: 'other', label: 'Other' },
];

// Price filter configuration
// Note: unlike most prices this is not handled in subunits
export const priceFilterConfig = {
  min: 0,
  max: 1000,
  step: 5,
};

// Activate booking dates filter on search page
export const dateRangeFilterConfig = {
  active: true,
};
