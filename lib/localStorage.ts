import { setClientApplicationCount } from "./clientCookies";
import { SavedApplication } from "@/types";
import { STORAGE_KEYS } from "@/constants/common";

export const localStorageService = {
  getApplications: (): SavedApplication[] => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveApplications: (applications: SavedApplication[]): void => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEYS.APPLICATIONS,
        JSON.stringify(applications)
      );
      setClientApplicationCount(applications.length);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  },

  addApplication: (application: SavedApplication): SavedApplication[] => {
    const applications = localStorageService.getApplications();
    applications.push(application);
    localStorageService.saveApplications(applications);
    return applications;
  },

  updateApplication: (
    id: string,
    updatedApplication: Partial<SavedApplication>
  ): SavedApplication[] => {
    const applications = localStorageService.getApplications();
    const updatedApplications = applications.map((app) =>
      app.id === id ? { ...app, ...updatedApplication } : app
    );
    localStorageService.saveApplications(updatedApplications);
    return updatedApplications;
  },

  deleteApplication: (id: string): SavedApplication[] => {
    const applications = localStorageService.getApplications();
    const filteredApplications = applications.filter((app) => app.id !== id);
    localStorageService.saveApplications(filteredApplications);
    return filteredApplications;
  },
};
