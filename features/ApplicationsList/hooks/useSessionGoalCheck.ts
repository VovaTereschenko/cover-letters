import { useEffect } from "react";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS, STORAGE_KEYS } from "@/constants";
import type { ApplicationsAction } from "../types";

export function useSessionGoalCheck({
  initialApplicationsLength,
  dispatch,
}: {
  initialApplicationsLength: number;
  dispatch: React.Dispatch<ApplicationsAction>;
}) {
  useEffect(() => {
    const justReachedTheGoal =
      sessionStorage.getItem(STORAGE_KEYS.GOAL_ACHIEVEMENT) === "true";

    if (
      initialApplicationsLength >= RECOMMENDED_AMOUNT_OF_APPLICATIONS &&
      justReachedTheGoal
    ) {
      let isCancelled = false;

      const showGoalAchievement = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!isCancelled) {
          dispatch({ type: "SHOW_GOAL_ACHIEVEMENT" });
          sessionStorage.removeItem(STORAGE_KEYS.GOAL_ACHIEVEMENT);
        }
      };

      showGoalAchievement();

      return () => {
        isCancelled = true;
      };
    }
  }, [initialApplicationsLength, dispatch]);
}
