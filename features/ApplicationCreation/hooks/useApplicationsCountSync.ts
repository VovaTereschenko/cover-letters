import { useApplicationsCountSync as useSharedApplicationsCountSync } from "@/hooks/shared";
import type { JobApplicationAction } from "../types";

export function useApplicationsCountSync(
  initialApplicationsCount: number,
  dispatch: React.Dispatch<JobApplicationAction>
) {
  useSharedApplicationsCountSync({
    initialCount: initialApplicationsCount,
    dispatch,
    setCountAction: (count: number): JobApplicationAction => ({
      type: "SET_APPLICATIONS_COUNT",
      payload: count,
    }),
  });
}
