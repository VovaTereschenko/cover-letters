import { localStorageService } from "@/lib/localStorage";
import { SavedApplication, ToastType } from "@/types";

export const updateApplicationContent = async ({
  applicationId,
  content,
  onApplicationsChange,
  onApplicationsCountChange,
}: {
  applicationId: string;
  content: string;
  onApplicationsChange: (applications: SavedApplication[]) => void;
  onApplicationsCountChange: (count: number) => void;
}) => {
  try {
    const updatedApplications = localStorageService.updateApplication(
      applicationId,
      { content }
    );
    onApplicationsChange(updatedApplications);
    onApplicationsCountChange(updatedApplications.length);
    window.dispatchEvent(new CustomEvent("applicationsUpdated"));
  } catch (error) {
    console.error("Error updating application:", error);
  }
};

export const deleteApplication = async ({
  applicationId,
  onApplicationsChange,
  onApplicationsCountChange,
  onSuccess,
  onError,
}: {
  applicationId: string;
  onApplicationsChange: (applications: SavedApplication[]) => void;
  onApplicationsCountChange: (count: number) => void;
  onSuccess: () => void;
  onError: () => void;
}) => {
  try {
    const updatedApplications =
      localStorageService.deleteApplication(applicationId);
    onApplicationsChange(updatedApplications);
    onApplicationsCountChange(updatedApplications.length);
    window.dispatchEvent(new CustomEvent("applicationsUpdated"));
    onSuccess();
  } catch (error) {
    console.error("Error deleting application:", error);
    onError();
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
  onApplicationsChange,
  onApplicationsCountChange,
  onHydrated,
}: {
  onApplicationsChange: (applications: SavedApplication[]) => void;
  onApplicationsCountChange: (count: number) => void;
  onHydrated: () => void;
}) => {
  const storedApplications = localStorageService.getApplications();

  if (storedApplications.length) {
    onApplicationsChange(storedApplications);
    onApplicationsCountChange(storedApplications.length);
  } else {
    onApplicationsChange([]);
    onApplicationsCountChange(0);
  }

  onHydrated();
  window.dispatchEvent(new CustomEvent("applicationsUpdated"));
};
