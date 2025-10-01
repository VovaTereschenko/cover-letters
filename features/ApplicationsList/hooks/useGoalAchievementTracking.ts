import { useGoalAchievementTracking as useSharedGoalAchievementTracking } from "@/hooks/shared";
import type { ApplicationsAction } from "../types";

export function useGoalAchievementTracking({
  applicationsLength,
  previousCount,
  dispatch,
}: {
  applicationsLength: number;
  previousCount: number;
  dispatch: React.Dispatch<ApplicationsAction>;
}) {
  useSharedGoalAchievementTracking({
    currentCount: applicationsLength,
    previousCount,
    dispatch,
    showGoalAchievementAction: (): ApplicationsAction => ({
      type: "SHOW_GOAL_ACHIEVEMENT",
    }),
    setPreviousCountAction: (count: number): ApplicationsAction => ({
      type: "SET_PREVIOUS_COUNT",
      payload: count,
    }),
  });
}
