/**
 * Set the 2FA verification status in a cookie (client-side only)
 */
export function set2FAVerified(verified: boolean) {
  // Only run in client-side code
  if (typeof window !== "undefined") {
    document.cookie = `2fa_verified=${verified}; path=/; max-age=${
      verified ? 86400 : 0
    }`; // 24 hours if verified, otherwise clear it

    // Also store in sessionStorage as a backup
    if (verified) {
      sessionStorage.setItem("2fa_verified", "true");
    } else {
      sessionStorage.removeItem("2fa_verified");
    }
  }
}

/**
 * Check if 2FA has been verified (client-side only)
 */
export function is2FAVerified(): boolean {
  // Only run in client-side code
  if (typeof window !== "undefined") {
    return (
      document.cookie.includes("2fa_verified=true") ||
      sessionStorage.getItem("2fa_verified") === "true"
    );
  }
  return false;
}

/**
 * Clear 2FA verification when logging out
 */
export function clearAuth() {
  // Only run in client-side code
  if (typeof window !== "undefined") {
    // Clear the cookie
    document.cookie = "2fa_verified=; path=/; max-age=0";
    document.cookie = "auth_token=; path=/; max-age=0";

    // Clear session storage
    sessionStorage.removeItem("2fa_verified");
    localStorage.removeItem("user");
  }
}
