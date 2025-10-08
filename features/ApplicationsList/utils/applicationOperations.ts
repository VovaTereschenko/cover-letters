import { applicationsActions } from "@/store/applications";
import type { SavedApplication } from "@/types";

/**
 * Simplified application operations using the reactive store
 * No more manual event dispatching or localStorage sync needed
 */

export const createApplication = (
  applicationData: Omit<SavedApplication, "id" | "createdAt">
) => {
  const application: SavedApplication = {
    ...applicationData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  applicationsActions.addApplication(application);
  return application;
};

export const updateApplicationContent = (id: string, content: string) => {
  applicationsActions.updateApplication(id, { content });
};

export const deleteApplication = (id: string) => {
  applicationsActions.deleteApplication(id);
};

export const copyToClipboard = async (content: string): Promise<boolean> => {
  if (!navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};
