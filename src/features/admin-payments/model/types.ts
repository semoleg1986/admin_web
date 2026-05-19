export type AdminRejectReason =
  | "admin_declined"
  | "payment_verification_failed"
  | "duplicate_payment_attempt"
  | "stale_pending_intent"
  | "conflict_existing_access";

export type AdminPaymentReviewState =
  | "ready_for_approval"
  | "stale_pending_intent"
  | "conflict_existing_access"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired";

export const ADMIN_PAYMENT_REJECT_REASONS: AdminRejectReason[] = [
  "admin_declined",
  "payment_verification_failed",
  "duplicate_payment_attempt",
  "stale_pending_intent",
  "conflict_existing_access"
];

export interface AdminPaymentIntentItem {
  payment_intent_id: string;
  parent_id: string;
  student_id: string;
  offer_id: string;
  course_id: string;
  status: string;
  base_price: number;
  final_price: number;
  bonus_amount: number;
  currency: string;
  expires_at: string | null;
  rejected_reason: AdminRejectReason | null;
  review_state: AdminPaymentReviewState;
  recommended_reject_reason: AdminRejectReason | null;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface CourseAccessGrantItem {
  access_grant_id: string;
  payment_intent_id: string;
  offer_id: string;
  course_id: string;
  student_id: string;
  status: string;
  granted_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
  version: number;
}
