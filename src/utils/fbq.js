export const fbqTrack = (...args) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
};