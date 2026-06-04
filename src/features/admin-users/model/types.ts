export type StaffInviteRole = "teacher" | "content_manager";

export const STAFF_INVITE_ROLES: StaffInviteRole[] = ["teacher", "content_manager"];

export interface CreateStaffOnboardingPayload {
  display_name: string;
  email: string;
  role: StaffInviteRole;
}

export interface AdminUserResponse {
  user_id: string;
  email: string;
  display_name: string;
  phone: string | null;
  status: string;
  roles: string[];
  created_at: string;
  updated_at: string;
  version: number;
}

export interface StaffInviteResponse {
  invite_id: string;
  creator_user_id: string;
  target_user_id: string;
  email: string;
  roles: StaffInviteRole[];
  status: string;
  expires_at: string;
  used_at: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
  version: number;
  invite_token: string | null;
}

export interface StaffOnboardingResponse {
  invite: StaffInviteResponse;
  user: AdminUserResponse;
}
