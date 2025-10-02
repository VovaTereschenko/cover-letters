import { localStorageService } from "@/lib/localStorage";
import { handleGoalAchievement } from "./goalAchievement";

export const autoSaveApplication = async (
  content: string,
  getSavedApplicationId: () => string,
  applicationData: {
    titleText: string;
    company: string;
    jobTitle: string;
    applicationsCount: number;
  },
  onSavedApplicationIdChange: (id: string) => void,
  onApplicationsCountChange: (count: number) => void
) => {
  const application = {
    id: Date.now().toString(),
    title: applicationData.titleText,
    company: applicationData.company,
    jobTitle: applicationData.jobTitle,
    content: content,
    createdAt: new Date().toISOString(),
  };

  try {
    const savedApplicationId = getSavedApplicationId();
    if (savedApplicationId) {
      localStorageService.deleteApplication(savedApplicationId);
    }

    const updatedApplications = localStorageService.addApplication(application);

    onSavedApplicationIdChange(application.id);

    const previousCount = applicationData.applicationsCount;

    onApplicationsCountChange(updatedApplications.length);

    handleGoalAchievement(updatedApplications.length, previousCount);

    window.dispatchEvent(new CustomEvent("applicationsUpdated"));
  } catch (error) {
    console.error("Error saving application:", error);
  }
};

export const deleteSavedApplication = async (
  getSavedApplicationId: () => string,
  onApplicationsCountChange: (count: number) => void,
  onSavedApplicationIdChange: (id: string) => void
) => {
  const savedApplicationId = getSavedApplicationId();
  if (!savedApplicationId) return;

  try {
    const updatedApplications =
      localStorageService.deleteApplication(savedApplicationId);
    onApplicationsCountChange(updatedApplications.length);
    onSavedApplicationIdChange("");
    window.dispatchEvent(new CustomEvent("applicationsUpdated"));
  } catch (error) {
    console.error("Error deleting application:", error);
  }
};
