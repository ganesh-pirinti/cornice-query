import { REQUIRED_POINTS } from '../config/boostPoints';

export interface PointsTransaction {
  id: string;
  userId: string;
  type: 'registration_bonus' | 'early_user_bonus' | 'referral_reward' | 'discount_redemption';
  points: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export function isDiscountUnlocked(points: number): boolean {
  return points >= REQUIRED_POINTS;
}
