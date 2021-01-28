export const twoFactorTracking = (mixpanel) => {
  mixpanel.track('View 2FA page')

  mixpanel.track_forms('form', '2FA form');
}