import { useEffect } from "react";

export function useNavigationCleanup({
  abortControllerRef,
  onNavigationCleanup,
  onBeforeUnload,
}: {
  abortControllerRef: React.RefObject<AbortController | null>;
  onNavigationCleanup: () => void;
  onBeforeUnload?: () => void;
}) {
  useEffect(() => {
    const handleNavigation = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        onNavigationCleanup();
      }
    };

    const handleBeforeUnload = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        onBeforeUnload?.();
      }
    };

    window.addEventListener("navigationStarted", handleNavigation);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("navigationStarted", handleNavigation);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [abortControllerRef, onNavigationCleanup, onBeforeUnload]);
}
