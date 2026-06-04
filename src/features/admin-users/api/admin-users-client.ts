import { useApiClient } from "~/shared/api/use-api-client";
import type {
  CreateStaffInvitePayload,
  StaffInviteResponse
} from "~/features/admin-users/model/types";

export function useAdminUsersClient() {
  const api = useApiClient();

  return {
    createStaffInvite(userId: string, payload: CreateStaffInvitePayload) {
      return api.post<StaffInviteResponse, CreateStaffInvitePayload>(
        `/admin/users/${encodeURIComponent(userId)}/staff-invite`,
        payload
      );
    }
  };
}
