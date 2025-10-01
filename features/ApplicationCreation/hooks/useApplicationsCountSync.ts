import { useEffect } from "react";
import { localStorageService } from "@/lib/localStorage";
import type { JobApplicationAction } from "../types";

export function useApplicationsCountSync(
  initialApplicationsCount: number,
  dispatch: React.Dispatch<JobApplicationAction>
) {
  useEffect(() => {
    const applications = localStorageService.getApplications();
    const actualCount = applications.length;

    if (actualCount !== initialApplicationsCount) {
      dispatch({ type: "SET_APPLICATIONS_COUNT", payload: actualCount });
    }
  }, [initialApplicationsCount, dispatch]);
}
