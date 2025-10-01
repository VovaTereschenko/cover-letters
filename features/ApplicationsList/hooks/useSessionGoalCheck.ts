import { useEffect } from "react";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS, STORAGE_KEYS } from "@/constants";
import type { ApplicationsAction } from "../types";

export function useSessionGoalCheck(
  initialApplicationsLength: number,
  dispatch: React.Dispatch<ApplicationsAction>
) {
  useEffect(() => {
    const justReachedTheGoal =
      sessionStorage.getItem(STORAGE_KEYS.GOAL_ACHIEVEMENT) === "true";

    if (
      initialApplicationsLength >= RECOMMENDED_AMOUNT_OF_APPLICATIONS &&
      justReachedTheGoal
    ) {
      const timer = setTimeout(() => {
        dispatch({ type: "SHOW_GOAL_ACHIEVEMENT" });
        sessionStorage.removeItem(STORAGE_KEYS.GOAL_ACHIEVEMENT);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [initialApplicationsLength, dispatch]);
}
