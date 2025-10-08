import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useState, useEffect } from "react";
import type { SavedApplication, HighlightColor } from "@/types";
import {
  ApplicationsSlice,
  createApplicationsSlice,
} from "./slices/applicationsSlice";
import { UISlice, createUISlice } from "./slices/uiSlice";

type AppStore = ApplicationsSlice & UISlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createApplicationsSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: "applications-storage",
      partialize: (state) => ({
        applications: state.applications,
        previousCount: state.previousCount,
      }),
    }
  )
);

export const useApplications = () => useAppStore((state) => state.applications);

export const useApplicationsCount = () =>
  useAppStore((state) => state.getCount());

export const useApplication = (id: string) =>
  useAppStore((state) => state.getApplication(id));

export const useHighlightColor = () =>
  useAppStore((state) => state.highlightColor);

export const useIsModalOpen = () => useAppStore((state) => state.isModalOpen);
export const useSelectedApplication = () =>
  useAppStore((state) => state.selectedApplication);
export const useEditedContent = () =>
  useAppStore((state) => state.editedContent);

export const useShowDeleteConfirm = () =>
  useAppStore((state) => state.showDeleteConfirm);
export const useApplicationToDelete = () =>
  useAppStore((state) => state.applicationToDelete);

export const useGoalAchievementState = () =>
  useAppStore((state) => state.showGoalAchievement);

export const usePreviousCount = () =>
  useAppStore((state) => state.previousCount);

export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

export const applicationsActions = {
  addApplication: (app: SavedApplication) =>
    useAppStore.getState().addApplication(app),
  updateApplication: (id: string, updates: Partial<SavedApplication>) =>
    useAppStore.getState().updateApplication(id, updates),
  deleteApplication: (id: string) =>
    useAppStore.getState().deleteApplication(id),

  openModal: (app: SavedApplication) => useAppStore.getState().openModal(app),
  closeModal: () => useAppStore.getState().closeModal(),
  setEditedContent: (content: string) =>
    useAppStore.getState().setEditedContent(content),
  showDeleteConfirmDialog: (id: string) =>
    useAppStore.getState().showDeleteConfirmDialog(id),
  hideDeleteConfirmDialog: () =>
    useAppStore.getState().hideDeleteConfirmDialog(),
  showGoalAchievementDialog: () =>
    useAppStore.getState().showGoalAchievementDialog(),
  hideGoalAchievementDialog: () =>
    useAppStore.getState().hideGoalAchievementDialog(),
  setPreviousCount: (count: number) =>
    useAppStore.getState().setPreviousCount(count),
  triggerHighlight: (color: HighlightColor) =>
    useAppStore.getState().triggerHighlight(color),
};

export const saveApplication = applicationsActions.addApplication;
export const deleteApplication = applicationsActions.deleteApplication;
