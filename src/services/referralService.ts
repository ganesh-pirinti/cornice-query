/**
 * ==============================================================================
 * CORNICE & QUERY — REFERRAL SERVICE
 * ==============================================================================
 */

const PENDING_REF_KEY = 'cq_pending_referral_code';

export function generateUniqueReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CQ-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function savePendingReferralCode(code: string): void {
  if (code && code.trim().startsWith('CQ-')) {
    localStorage.setItem(PENDING_REF_KEY, code.trim().toUpperCase());
  }
}

export function getPendingReferralCode(): string | null {
  return localStorage.getItem(PENDING_REF_KEY);
}

export function clearPendingReferralCode(): void {
  localStorage.removeItem(PENDING_REF_KEY);
}
