import { useEffect } from "react";

export function useNavigationCleanup<TAction>({
  abortControllerRef,
  dispatch,
  cleanupAction,
}: {
  abortControllerRef: React.RefObject<AbortController | null>;
  dispatch: React.Dispatch<TAction>;
  cleanupAction: () => TAction;
}) {
  useEffect(() => {
    const handleNavigation = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        dispatch(cleanupAction());
      }
    };

    const handleBeforeUnload = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

    window.addEventListener("navigationStarted", handleNavigation);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("navigationStarted", handleNavigation);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [abortControllerRef, dispatch, cleanupAction]);
}
