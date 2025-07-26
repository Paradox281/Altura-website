export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  TOUR_PACKAGE_DISKON: '/api/tour-package-diskon',
  TOP_DESTINATIONS: '/api/destinations/top',
  TESTIMONIALS: '/api/testimonials',
  DESTINATION_DETAIL: '/api/destinations/:id/detail',
} as const; 