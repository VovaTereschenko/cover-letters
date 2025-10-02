import { useEffect } from "react";
import { SavedApplication } from "@/types";
import { initializeApplications } from "../utils/applicationOperations";

export function useApplicationsInitialization({
  onApplicationsChange,
  onApplicationsCountChange,
  onHydrated,
}: {
  onApplicationsChange: (applications: SavedApplication[]) => void;
  onApplicationsCountChange: (count: number) => void;
  onHydrated: () => void;
}) {
  useEffect(() => {
    initializeApplications({
      onApplicationsChange,
      onApplicationsCountChange,
      onHydrated,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
