import { useCallback } from "react";
import { localStorageService } from "@/lib/localStorage";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS, STORAGE_KEYS } from "@/constants";
import type { JobApplicationState, JobApplicationAction } from "../types";

export function useApplicationStorage(
  state: JobApplicationState,
  dispatch: React.Dispatch<JobApplicationAction>
) {
  const autoSaveApplication = useCallback(
    async (content: string, getSavedApplicationId: () => string) => {
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

        // to show "You've just reached the goal" dialog on the applications page
        if (
          updatedApplications.length === RECOMMENDED_AMOUNT_OF_APPLICATIONS &&
          previousCount < RECOMMENDED_AMOUNT_OF_APPLICATIONS
        ) {
          sessionStorage.setItem(STORAGE_KEYS.GOAL_ACHIEVEMENT, "true");
        }

        window.dispatchEvent(new CustomEvent("applicationsUpdated"));
      } catch (error) {
        console.error("Error saving application:", error);
      }
    },
    [
      state.titleText,
      state.company,
      state.jobTitle,
      state.applicationsCount,
      dispatch,
    ]
  );

  const deleteSavedApplication = useCallback(
    async (getSavedApplicationId: () => string) => {
      const savedApplicationId = getSavedApplicationId();

      if (savedApplicationId) {
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
      }
    },
    [dispatch]
  );

  return {
    autoSaveApplication,
    deleteSavedApplication,
  };
}
