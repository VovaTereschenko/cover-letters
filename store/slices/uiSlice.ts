import { StateCreator } from "zustand";
import type { SavedApplication, HighlightColor } from "@/types";

export interface UISlice {
  isModalOpen: boolean;
  selectedApplication: SavedApplication | null;
  editedContent: string;

  showDeleteConfirm: boolean;
  applicationToDelete: string | null;

  showGoalAchievement: boolean;
  previousCount: number;

  highlightColor: HighlightColor;

  openModal: (application: SavedApplication) => void;
  closeModal: () => void;
  setEditedContent: (content: string) => void;

  showDeleteConfirmDialog: (applicationId: string) => void;
  hideDeleteConfirmDialog: () => void;

  showGoalAchievementDialog: () => void;
  hideGoalAchievementDialog: () => void;
  setPreviousCount: (count: number) => void;

  setHighlightColor: (color: HighlightColor) => void;
  triggerHighlight: (color: HighlightColor) => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  isModalOpen: false,
  selectedApplication: null,
  editedContent: "",

  showDeleteConfirm: false,
  applicationToDelete: null,

  showGoalAchievement: false,
  previousCount: 0,

  highlightColor: null,

  openModal: (application: SavedApplication) => {
    set({
      isModalOpen: true,
      selectedApplication: application,
      editedContent: application.content,
    });
  },

  closeModal: () => {
    set({
      isModalOpen: false,
      selectedApplication: null,
      editedContent: "",
    });
  },

  setEditedContent: (content: string) => {
    set({ editedContent: content });
  },

  showDeleteConfirmDialog: (applicationId: string) => {
    set({
      showDeleteConfirm: true,
      applicationToDelete: applicationId,
    });
  },

  hideDeleteConfirmDialog: () => {
    set({
      showDeleteConfirm: false,
      applicationToDelete: null,
    });
  },

  showGoalAchievementDialog: () => {
    set({ showGoalAchievement: true });
  },

  hideGoalAchievementDialog: () => {
    set({ showGoalAchievement: false });
  },

  setPreviousCount: (count: number) => {
    set({ previousCount: count });
  },

  setHighlightColor: (color: HighlightColor) => {
    set({ highlightColor: color });
  },

  triggerHighlight: (color: HighlightColor) => {
    set({ highlightColor: color });
    setTimeout(() => {
      set({ highlightColor: null });
    }, 2000);
  },
});
