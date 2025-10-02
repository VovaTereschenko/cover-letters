import { useNavigationCleanup as useSharedNavigationCleanup } from "@/hooks/shared";

export function useNavigationCleanup(
  abortControllerRef: React.RefObject<AbortController | null>,
  onNavigationCleanup: () => void,
  onBeforeUnload: () => void
) {
  useSharedNavigationCleanup({
    abortControllerRef,
    onNavigationCleanup,
    onBeforeUnload,
  });
}
