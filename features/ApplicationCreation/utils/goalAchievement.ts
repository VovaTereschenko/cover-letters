import { RECOMMENDED_AMOUNT_OF_APPLICATIONS, STORAGE_KEYS } from "@/constants";

const GOAL_CHECKED_KEY = "goalChecked";

export const handleGoalAchievement = (currentCount: number) => {
  let lastCheckedCount = 0;
  try {
    const stored = localStorage.getItem(GOAL_CHECKED_KEY);
    lastCheckedCount = stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.error("Error reading goal check from localStorage:", error);
  }

  if (
    currentCount === RECOMMENDED_AMOUNT_OF_APPLICATIONS &&
    lastCheckedCount < RECOMMENDED_AMOUNT_OF_APPLICATIONS
  ) {
    sessionStorage.setItem(STORAGE_KEYS.GOAL_ACHIEVEMENT, "true");
  }

  try {
    localStorage.setItem(GOAL_CHECKED_KEY, currentCount.toString());
  } catch (error) {
    console.error("Error writing goal check to localStorage:", error);
  }
};
