import { localStorageService } from "@/lib/localStorage";
import type { JobApplicationState, JobApplicationAction } from "../types";
import { handleGoalAchievement } from "./goalAchievement";
import { deleteSavedApplication } from "./applicationStorage";

export function createApplicationStorageHelpers({
  state,
  dispatch,
}: {
  state: JobApplicationState;
  dispatch: React.Dispatch<JobApplicationAction>;
}) {
  const autoSaveApplication = async (
    content: string,
    getSavedApplicationId: () => string
  ) => {
    const application = {
      id: Date.now().toString(),
      title: state.titleText,
      company: state.company,
      jobTitle: state.jobTitle,
      content: content,
      createdAt: new Date().toISOString(),
    };

    try {
      const savedApplicationId = getSavedApplicationId();
      if (savedApplicationId) {
        localStorageService.deleteApplication(savedApplicationId);
      }

      const updatedApplications =
        localStorageService.addApplication(application);

      dispatch({ type: "SET_SAVED_APPLICATION_ID", payload: application.id });

      const previousCount = state.applicationsCount;

      dispatch({
        type: "SET_APPLICATIONS_COUNT",
        payload: updatedApplications.length,
      });

      handleGoalAchievement(updatedApplications.length, previousCount);

      window.dispatchEvent(new CustomEvent("applicationsUpdated"));
    } catch (error) {
      console.error("Error saving application:", error);
    }
  };

  return {
    autoSaveApplication,
    deleteSavedApplication: (getSavedApplicationId: () => string) =>
      deleteSavedApplication(getSavedApplicationId, dispatch),
  };
}
