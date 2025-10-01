import { localStorageService } from "@/lib/localStorage";
import type { JobApplicationAction } from "../types";

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
