export const SHIPPING = {
  countries: ['DE', 'AT', 'CH'] as const,
  flatRateEUR: 1.99,
  freeAboveEUR: 50,
  estimatedDaysMin: 2,
  estimatedDaysMax: 4,
  carrier: 'DHL',
} as const;
