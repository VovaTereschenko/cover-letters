import { useEffect } from "react";
import { localStorageService } from "@/lib/localStorage";

/**
 * Abstract hook for synchronizing applications count with localStorage
 * Can be used by both ApplicationCreation and ApplicationsList features
 */
export function useApplicationsCountSync({
  initialCount,
  onCountChange,
}: {
  initialCount: number;
  onCountChange: (count: number) => void;
}) {
  useEffect(() => {
    const applications = localStorageService.getApplications();
    const actualCount = applications.length;

    if (actualCount === initialCount) return;

    onCountChange(actualCount);
  }, [initialCount, onCountChange]);
}
