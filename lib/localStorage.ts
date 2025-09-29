import { setClientApplicationCount } from "./clientCookies";

type SavedApplication = {
  id: string;
  title: string;
  company: string;
  jobTitle: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "saved_applications";

export const localStorageService = {
  getApplications: (): SavedApplication[] => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
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
