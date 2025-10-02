import { useApplicationsCountSync as useSharedApplicationsCountSync } from "@/hooks/shared";

export function useApplicationsCountSync(
  initialApplicationsCount: number,
  onCountChange: (count: number) => void
) {
  useSharedApplicationsCountSync({
    initialCount: initialApplicationsCount,
    onCountChange,
  });
}
