import { SavedApplication } from "@/types";

export type ApplicationsState = {
  applications: SavedApplication[];
  isHydrated: boolean;
  isModalOpen: boolean;
  showDeleteConfirm: boolean;
  showGoalAchievement: boolean;
  applicationToDelete: string | null;
  selectedApplication: SavedApplication | null;
  editedContent: string;
  previousCount: number;
};

export type ApplicationsAction =
  | { type: "SET_APPLICATIONS"; payload: SavedApplication[] }
  | { type: "SET_HYDRATED"; payload: boolean }
  | { type: "OPEN_MODAL"; payload: { application: SavedApplication } }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_EDITED_CONTENT"; payload: string }
  | { type: "SHOW_DELETE_CONFIRM"; payload: string }
  | { type: "HIDE_DELETE_CONFIRM" }
  | { type: "SHOW_GOAL_ACHIEVEMENT" }
  | { type: "HIDE_GOAL_ACHIEVEMENT" }
  | { type: "SET_PREVIOUS_COUNT"; payload: number };
