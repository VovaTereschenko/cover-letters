import { useEffect } from "react";
import { applicationsActions, usePreviousCount } from "@/store/applications";
import { SavedApplication } from "@/types";

export const useApplicationsInitialization = (
  initialApplications: SavedApplication[]
) => {
  const previousCount = usePreviousCount();

  useEffect(() => {
    if (previousCount === 0 && initialApplications.length > 0) {
      applicationsActions.setPreviousCount(initialApplications.length);
    }
  }, [initialApplications.length, previousCount]);
};
