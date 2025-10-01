import { localStorageService } from "@/lib/localStorage";
import { SavedApplication, ToastType } from "@/types";
import type { ApplicationsAction } from "../types";

export const updateApplicationContent = async ({
  applicationId,
  content,
  dispatch,
  setApplicationsCount,
}: {
  applicationId: string;
  content: string;
  dispatch: (action: ApplicationsAction) => void;
  setApplicationsCount: (count: number) => void;
}) => {
  try {
    const updatedApplications = localStorageService.updateApplication(
      applicationId,
      { content }
    );
    dispatch({ type: "SET_APPLICATIONS", payload: updatedApplications });
    setApplicationsCount(updatedApplications.length);
    window.dispatchEvent(new CustomEvent("applicationsUpdated"));
  } catch (error) {
    console.error("Error updating application:", error);
  }
};

export const deleteApplication = async ({
  applicationId,
  dispatch,
  setApplicationsCount,
  showToast,
}: {
  applicationId: string;
  dispatch: (action: ApplicationsAction) => void;
  setApplicationsCount: (count: number) => void;
  showToast: (message: string, type?: ToastType) => void;
}) => {
  try {
    const updatedApplications =
      localStorageService.deleteApplication(applicationId);
    dispatch({ type: "SET_APPLICATIONS", payload: updatedApplications });
    setApplicationsCount(updatedApplications.length);
    window.dispatchEvent(new CustomEvent("applicationsUpdated"));
    showToast("Application deleted successfully!", "delete");
  } catch (error) {
    console.error("Error deleting application:", error);
    showToast("Failed to delete application. Please try again.", "error");
  }
};

export const copyToClipboard = ({
  content,
  showToast,
}: {
  content: string;
  showToast: (message: string, type?: ToastType) => void;
}) => {
  navigator.clipboard.writeText(content);
  showToast("Copied to clipboard", "copy");
};

export const initializeApplications = ({
  initialApplications,
  dispatch,
  setApplicationsCount,
}: {
  initialApplications: SavedApplication[];
  dispatch: (action: ApplicationsAction) => void;
  setApplicationsCount: (count: number) => void;
}) => {
  const storedApplications = localStorageService.getApplications();

  const hasPlaceholders = initialApplications.some((app) =>
    app.id.startsWith("placeholder-")
  );

  if (storedApplications.length) {
    dispatch({ type: "SET_APPLICATIONS", payload: storedApplications });
    setApplicationsCount(storedApplications.length);
  } else if (!hasPlaceholders) {
    localStorageService.saveApplications(initialApplications);
    setApplicationsCount(initialApplications.length);
  } else {
    dispatch({ type: "SET_APPLICATIONS", payload: [] });
    setApplicationsCount(0);
  }

  dispatch({ type: "SET_HYDRATED", payload: true });
  window.dispatchEvent(new CustomEvent("applicationsUpdated"));
};
