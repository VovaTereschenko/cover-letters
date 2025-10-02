import { useEffect } from "react";
import { localStorageService } from "@/lib/localStorage";

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
