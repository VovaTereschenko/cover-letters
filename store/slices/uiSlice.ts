import { StateCreator } from "zustand";
import type { SavedApplication, HighlightColor } from "@/types";

type ModalState = {
  isModalOpen: boolean;
  selectedApplication: SavedApplication | null;
  editedContent: string;
};

type DeleteConfirmState = {
  showDeleteConfirm: boolean;
  applicationToDelete: string | null;
};

type GoalAchievementState = {
  showGoalAchievement: boolean;
  previousCount: number;
};

type HighlightState = {
  highlightColor: HighlightColor;
};

type ModalActions = {
  openModal: (application: SavedApplication) => void;
  closeModal: () => void;
  setEditedContent: (content: string) => void;
};

type DeleteConfirmActions = {
  showDeleteConfirmDialog: (applicationId: string) => void;
  hideDeleteConfirmDialog: () => void;
};

type GoalAchievementActions = {
  showGoalAchievementDialog: () => void;
  hideGoalAchievementDialog: () => void;
  setPreviousCount: (count: number) => void;
};

type HighlightActions = {
  setHighlightColor: (color: HighlightColor) => void;
  triggerHighlight: (color: HighlightColor) => void;
};

export type UISlice = ModalState &
  DeleteConfirmState &
  GoalAchievementState &
  HighlightState &
  ModalActions &
  DeleteConfirmActions &
  GoalAchievementActions &
  HighlightActions;

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
