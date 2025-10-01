import { RECOMMENDED_AMOUNT_OF_APPLICATIONS, STORAGE_KEYS } from "@/constants";

export const handleGoalAchievement = (
  currentCount: number,
  previousCount: number
) => {
  if (
    currentCount === RECOMMENDED_AMOUNT_OF_APPLICATIONS &&
    previousCount < RECOMMENDED_AMOUNT_OF_APPLICATIONS
  ) {
    sessionStorage.setItem(STORAGE_KEYS.GOAL_ACHIEVEMENT, "true");
  }
};
