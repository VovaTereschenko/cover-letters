import { useGoalAchievementTracking as useSharedGoalAchievementTracking } from "@/hooks/shared";

export function useGoalAchievementTracking({
  applicationsLength,
  previousCount,
  onGoalAchieved,
  onCountUpdate,
}: {
  applicationsLength: number;
  previousCount: number;
  onGoalAchieved: () => void;
  onCountUpdate: (count: number) => void;
}) {
  useSharedGoalAchievementTracking({
    currentCount: applicationsLength,
    previousCount,
    onGoalAchieved,
    onCountUpdate,
  });
}
