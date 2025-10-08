import { applicationsActions } from "@/store/applications";

export const useGoalAchievementActions = () => {
  const handleCloseGoalAchievement = () => {
    applicationsActions.hideGoalAchievementDialog();
  };

  return {
    handleCloseGoalAchievement,
  };
};
