import { localStorageService } from "@/lib/localStorage";

export const deleteSavedApplication = async (
  savedApplicationId: string,
  onApplicationsCountChange: (count: number) => void,
  onSavedApplicationIdChange: (id: string) => void
) => {
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
