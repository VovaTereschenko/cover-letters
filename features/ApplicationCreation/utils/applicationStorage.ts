import { localStorageService } from "@/lib/localStorage";
import type { JobApplicationAction } from "../types";
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
  dispatch: React.Dispatch<JobApplicationAction>
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

    dispatch({ type: "SET_SAVED_APPLICATION_ID", payload: application.id });

    const previousCount = applicationData.applicationsCount;

    dispatch({
      type: "SET_APPLICATIONS_COUNT",
      payload: updatedApplications.length,
    });

    // to show "You've just reached the goal" dialog on the applications page
    handleGoalAchievement(updatedApplications.length, previousCount);

    window.dispatchEvent(new CustomEvent("applicationsUpdated"));
  } catch (error) {
    console.error("Error saving application:", error);
  }
};

export const deleteSavedApplication = async (
  getSavedApplicationId: () => string,
  dispatch: React.Dispatch<JobApplicationAction>
) => {
  const savedApplicationId = getSavedApplicationId();
  if (!savedApplicationId) return;

  try {
    const updatedApplications =
      localStorageService.deleteApplication(savedApplicationId);
    dispatch({
      type: "SET_APPLICATIONS_COUNT",
      payload: updatedApplications.length,
    });
    dispatch({ type: "SET_SAVED_APPLICATION_ID", payload: "" });
    window.dispatchEvent(new CustomEvent("applicationsUpdated"));
  } catch (error) {
    console.error("Error deleting application:", error);
  }
};
