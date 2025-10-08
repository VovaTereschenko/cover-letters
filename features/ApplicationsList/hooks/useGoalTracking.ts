import { useCallback } from "react";
import {
  useApplications,
  usePreviousCount,
  applicationsActions,
} from "@/store/applications";
import {
  useGoalAchievementTracking,
  useSessionGoalCheck,
} from "@/hooks/shared";

export const useGoalTracking = () => {
  const applications = useApplications();
  const previousCount = usePreviousCount();

  const handleGoalAchieved = useCallback(() => {
    applicationsActions.showGoalAchievementDialog();
  }, []);

  const handleCountUpdate = useCallback((count: number) => {
    applicationsActions.setPreviousCount(count);
  }, []);

  useGoalAchievementTracking({
    currentCount: applications.length,
    previousCount: previousCount,
    onGoalAchieved: handleGoalAchieved,
    onCountUpdate: handleCountUpdate,
  });

  useSessionGoalCheck({
    applicationCount: applications.length,
    onGoalAchieved: handleGoalAchieved,
  });

  return {
    handleGoalAchieved,
  };
};
