import { useSessionGoalCheck as useSharedSessionGoalCheck } from "@/hooks/shared";
import type { ApplicationsAction } from "../types";

export function useSessionGoalCheck({
  initialApplicationsLength,
  dispatch,
}: {
  initialApplicationsLength: number;
  dispatch: React.Dispatch<ApplicationsAction>;
}) {
  useSharedSessionGoalCheck({
    applicationCount: initialApplicationsLength,
    dispatch,
    showGoalAchievementAction: (): ApplicationsAction => ({
      type: "SHOW_GOAL_ACHIEVEMENT",
    }),
  });
}
