import { applicationsActions } from "@/store/applications";
import { handleGoalAchievement } from "./goalAchievement";

interface ApplicationData {
  jobTitle: string;
  company: string;
}

export const saveApplication = async (
  content: string,
  formData: ApplicationData,
  savedApplicationId: string | null,
  applicationsCount: number,
  setSavedApplicationId: (id: string) => void
): Promise<void> => {
  const application = {
    id: Date.now().toString(),
    content,
    title: formData.jobTitle + " at " + formData.company,
    company: formData.company,
    jobTitle: formData.jobTitle,
    createdAt: new Date().toISOString(),
  };

  try {
    if (savedApplicationId) {
      applicationsActions.deleteApplication(savedApplicationId);
    }

    applicationsActions.addApplication(application);

    setSavedApplicationId(application.id);

    const newCount = savedApplicationId
      ? applicationsCount
      : applicationsCount + 1;
    handleGoalAchievement(newCount);
  } catch (error) {
    console.error("Error saving application:", error);
  }
};

export const deleteApplication = async (
  savedApplicationId: string | null,
  setSavedApplicationId: (id: string) => void
): Promise<boolean> => {
  if (savedApplicationId) {
    try {
      applicationsActions.deleteApplication(savedApplicationId);
      setSavedApplicationId("");
      return true;
    } catch (error) {
      console.error("Error deleting application:", error);
      return false;
    }
  }
  return false;
};
