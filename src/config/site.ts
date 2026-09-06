/**
 * ==============================================================================
 * CORNICE & QUERY — SITE CONFIGURATION
 * ==============================================================================
 */

export const SITE_URL = 
  import.meta.env.VITE_SITE_URL || 
  (typeof window !== 'undefined' ? window.location.origin : 'https://cq-resource-hub.dev');

export function getReferralUrl(referralCode: string): string {
  return `${SITE_URL}/signup?ref=${referralCode}`;
}
