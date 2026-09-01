// Square integration placeholder.
//
// When credentials are available, fill these in (or move them to env vars:
// VITE_SQUARE_APP_ID / VITE_SQUARE_LOCATION_ID) and wire up the Web Payments
// SDK in src/pages/Checkout.jsx. Until then the checkout page collects the
// order and shows a "payments coming soon" state.
export const square = {
  appId: import.meta.env.VITE_SQUARE_APP_ID || null,
  locationId: import.meta.env.VITE_SQUARE_LOCATION_ID || null,
  get configured() {
    return Boolean(this.appId && this.locationId);
  },
};
