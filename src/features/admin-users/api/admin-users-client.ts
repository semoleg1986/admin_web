import { useApiClient } from "~/shared/api/use-api-client";
import type {
  CreateStaffOnboardingPayload,
  StaffOnboardingResponse
} from "~/features/admin-users/model/types";

export function useAdminUsersClient() {
  const api = useApiClient();

  return {
    createStaffOnboarding(payload: CreateStaffOnboardingPayload) {
      return api.post<StaffOnboardingResponse, CreateStaffOnboardingPayload>(
        "/admin/users/staff-onboarding",
        payload
      );
    }
  };
}
