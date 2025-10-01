import type { ApplicationsState, ApplicationsAction } from "../types";

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

export function applicationsReducer(
  state: ApplicationsState,
  action: ApplicationsAction
): ApplicationsState {
  switch (action.type) {
    case "SET_APPLICATIONS":
      return { ...state, applications: action.payload };
    case "SET_HYDRATED":
      return { ...state, isHydrated: action.payload };
    case "OPEN_MODAL":
      return {
        ...state,
        isModalOpen: true,
        selectedApplication: action.payload.application,
        editedContent: action.payload.application.content,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        isModalOpen: false,
        selectedApplication: null,
        editedContent: "",
      };
    case "SET_EDITED_CONTENT":
      return { ...state, editedContent: action.payload };
    case "SHOW_DELETE_CONFIRM":
      return {
        ...state,
        showDeleteConfirm: true,
        applicationToDelete: action.payload,
      };
    case "HIDE_DELETE_CONFIRM":
      return {
        ...state,
        showDeleteConfirm: false,
        applicationToDelete: null,
      };
    case "SHOW_GOAL_ACHIEVEMENT":
      return { ...state, showGoalAchievement: true };
    case "HIDE_GOAL_ACHIEVEMENT":
      return { ...state, showGoalAchievement: false };
    case "SET_PREVIOUS_COUNT":
      return { ...state, previousCount: action.payload };
    default:
      return assertNever(action);
  }
}
