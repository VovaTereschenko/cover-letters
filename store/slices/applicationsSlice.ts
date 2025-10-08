import { StateCreator } from "zustand";
import type { SavedApplication } from "@/types";

type ApplicationsState = {
  applications: SavedApplication[];
};

type ApplicationsGetters = {
  getApplications: () => SavedApplication[];
  getCount: () => number;
  getApplication: (id: string) => SavedApplication | undefined;
};

type ApplicationsActions = {
  addApplication: (application: SavedApplication) => void;
  updateApplication: (id: string, updates: Partial<SavedApplication>) => void;
  deleteApplication: (id: string) => void;
};

export type ApplicationsSlice = ApplicationsState &
  ApplicationsGetters &
  ApplicationsActions;

export const createApplicationsSlice: StateCreator<
  ApplicationsSlice,
  [],
  [],
  ApplicationsSlice
> = (set, get) => ({
  applications: [],

  getApplications: () => get().applications,
  getCount: () => get().applications.length,
  getApplication: (id: string) =>
    get().applications.find((app) => app.id === id),

  addApplication: (application: SavedApplication) => {
    set((state) => ({
      applications: [...state.applications, application],
    }));
  },

  updateApplication: (id: string, updates: Partial<SavedApplication>) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      ),
    }));
  },

  deleteApplication: (id: string) => {
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    }));
  },
});
