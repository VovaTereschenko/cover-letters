import { useEffect } from "react";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS, STORAGE_KEYS } from "@/constants";

export function useSessionGoalCheck({
  applicationCount,
  onGoalAchieved,
}: {
  applicationCount: number;
  onGoalAchieved: () => void;
}) {
  useEffect(() => {
    const justReachedTheGoal =
      sessionStorage.getItem(STORAGE_KEYS.GOAL_ACHIEVEMENT) === "true";

    if (
      applicationCount >= RECOMMENDED_AMOUNT_OF_APPLICATIONS &&
      justReachedTheGoal
    ) {
      let isCancelled = false;

      const showGoalAchievement = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!isCancelled) {
          onGoalAchieved();
          sessionStorage.removeItem(STORAGE_KEYS.GOAL_ACHIEVEMENT);
        }
      };

      showGoalAchievement();

      return () => {
        isCancelled = true;
      };
    }
  }, [applicationCount, onGoalAchieved]);
}
