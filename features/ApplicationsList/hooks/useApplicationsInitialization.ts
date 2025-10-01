import { useEffect } from "react";
import { SavedApplication } from "@/types";
import type { ApplicationsAction } from "../types";
import { initializeApplications } from "../utils/applicationOperations";

export function useApplicationsInitialization(
  initialApplications: SavedApplication[],
  dispatch: React.Dispatch<ApplicationsAction>,
  setApplicationsCount: (count: number) => void
) {
  useEffect(() => {
    initializeApplications({
      initialApplications,
      dispatch,
      setApplicationsCount,
    });
  }, [initialApplications, setApplicationsCount, dispatch]);
}
