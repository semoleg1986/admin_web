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
