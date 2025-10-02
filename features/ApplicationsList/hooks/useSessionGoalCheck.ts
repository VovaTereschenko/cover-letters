import { useSessionGoalCheck as useSharedSessionGoalCheck } from "@/hooks/shared";

export function useSessionGoalCheck({
  initialApplicationsLength,
  onGoalAchieved,
}: {
  initialApplicationsLength: number;
  onGoalAchieved: () => void;
}) {
  useSharedSessionGoalCheck({
    applicationCount: initialApplicationsLength,
    onGoalAchieved,
  });
}
