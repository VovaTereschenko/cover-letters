import { useEffect } from "react";
import type { JobApplicationAction } from "../types";

export function useNavigationCleanup(
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  dispatch: React.Dispatch<JobApplicationAction>
) {
  useEffect(() => {
    const handleNavigation = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        dispatch({ type: "SET_IS_GENERATING", payload: false });
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
  }, [abortControllerRef, dispatch]);
}
