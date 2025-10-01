import { useNavigationCleanup as useSharedNavigationCleanup } from "@/hooks/shared";
import type { JobApplicationAction } from "../types";

export function useNavigationCleanup(
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  dispatch: React.Dispatch<JobApplicationAction>
) {
  useSharedNavigationCleanup({
    abortControllerRef,
    dispatch,
    cleanupAction: (): JobApplicationAction => ({
      type: "SET_IS_GENERATING",
      payload: false,
    }),
  });
}
