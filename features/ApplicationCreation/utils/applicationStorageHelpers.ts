import { localStorageService } from "@/lib/localStorage";
import { handleGoalAchievement } from "./goalAchievement";
import { deleteSavedApplication } from "./applicationStorage";

export function createApplicationStorageHelpers({
  titleText,
  company,
  jobTitle,
  applicationsCount,
  savedApplicationId,
  onSavedApplicationIdChange,
  onApplicationsCountChange,
}: {
  titleText: string;
  company: string;
  jobTitle: string;
  applicationsCount: number;
  savedApplicationId: string;
  onSavedApplicationIdChange: (id: string) => void;
  onApplicationsCountChange: (count: number) => void;
}) {
  const saveApplication = async (content: string) => {
    const application = {
      id: Date.now().toString(),
      title: titleText,
      company: company,
      jobTitle: jobTitle,
      content: content,
      createdAt: new Date().toISOString(),
    };

    try {
      if (savedApplicationId) {
        localStorageService.deleteApplication(savedApplicationId);
      }

      const updatedApplications =
        localStorageService.addApplication(application);

      onSavedApplicationIdChange(application.id);

      const previousCount = applicationsCount;

      onApplicationsCountChange(updatedApplications.length);

      handleGoalAchievement(updatedApplications.length, previousCount);

      window.dispatchEvent(new CustomEvent("applicationsUpdated"));
    } catch (error) {
      console.error("Error saving application:", error);
    }
  };

  const removeApplication = () =>
    deleteSavedApplication(
      savedApplicationId,
      onApplicationsCountChange,
      onSavedApplicationIdChange
    );

  return {
    autoSaveApplication: saveApplication,
    deleteSavedApplication: removeApplication,
  };
}
