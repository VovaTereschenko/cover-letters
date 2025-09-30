import { useEffect, useReducer } from "react";
import { useApplicationsCount } from "@/contexts/ApplicationsCountContext";
import { useToast } from "@/contexts/ToastContext";
import { localStorageService } from "@/lib/localStorage";
import { SavedApplication } from "@/types";

type ApplicationsState = {
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

type ApplicationsAction =
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

function applicationsReducer(
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
      return state;
  }
}

export function useApplicationsList(initialApplications: SavedApplication[]) {
  const initialState: ApplicationsState = {
    applications: initialApplications,
    isHydrated: false,
    isModalOpen: false,
    showDeleteConfirm: false,
    showGoalAchievement: false,
    applicationToDelete: null,
    selectedApplication: null,
    editedContent: "",
    previousCount: initialApplications.length,
  };

  const [state, dispatch] = useReducer(applicationsReducer, initialState);
  const { setApplicationsCount } = useApplicationsCount();
  const { showToast } = useToast();

  useEffect(() => {
    const storedApplications = localStorageService.getApplications();

    const hasPlaceholders = initialApplications.some((app) =>
      app.id.startsWith("placeholder-")
    );

    if (storedApplications.length > 0) {
      dispatch({ type: "SET_APPLICATIONS", payload: storedApplications });
      setApplicationsCount(storedApplications.length);
    } else if (!hasPlaceholders) {
      localStorageService.saveApplications(initialApplications);
      setApplicationsCount(initialApplications.length);
    } else {
      dispatch({ type: "SET_APPLICATIONS", payload: [] });
      setApplicationsCount(0);
    }

    dispatch({ type: "SET_HYDRATED", payload: true });
    window.dispatchEvent(new CustomEvent("applicationsUpdated"));
  }, [initialApplications, setApplicationsCount]);

  useEffect(() => {
    if (state.applications.length === 5 && state.previousCount < 5) {
      dispatch({ type: "SHOW_GOAL_ACHIEVEMENT" });
    }
    dispatch({
      type: "SET_PREVIOUS_COUNT",
      payload: state.applications.length,
    });
  }, [state.applications.length, state.previousCount]);

  useEffect(() => {
    const justReached5 =
      sessionStorage.getItem("justReached5Applications") === "true";

    if (initialApplications.length >= 5 && justReached5) {
      const timer = setTimeout(() => {
        dispatch({ type: "SHOW_GOAL_ACHIEVEMENT" });
        sessionStorage.removeItem("justReached5Applications");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [initialApplications.length]);

  const handleCardClick = (app: SavedApplication) => {
    dispatch({ type: "OPEN_MODAL", payload: { application: app } });
  };

  const handleModalClose = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const handleSaveChanges = async () => {
    if (state.selectedApplication) {
      try {
        const updatedApplications = localStorageService.updateApplication(
          state.selectedApplication.id,
          { content: state.editedContent }
        );
        dispatch({ type: "SET_APPLICATIONS", payload: updatedApplications });
        setApplicationsCount(updatedApplications.length);
        window.dispatchEvent(new CustomEvent("applicationsUpdated"));
      } catch (error) {
        console.error("Error updating application:", error);
      }
    }
    handleModalClose();
  };

  const handleSaveAndCloseWithToast = async () => {
    await handleSaveChanges();
    setTimeout(() => {
      showToast("Changes saved successfully!", "save");
    }, 100);
  };

  const handleDeleteApplication = async (appId: string) => {
    try {
      const updatedApplications = localStorageService.deleteApplication(appId);
      dispatch({ type: "SET_APPLICATIONS", payload: updatedApplications });
      setApplicationsCount(updatedApplications.length);
      window.dispatchEvent(new CustomEvent("applicationsUpdated"));
      showToast("Application deleted successfully!", "delete");
    } catch (error) {
      console.error("Error deleting application:", error);
      showToast("Failed to delete application. Please try again.", "error");
    }
    dispatch({ type: "HIDE_DELETE_CONFIRM" });
  };

  const handleDeleteClick = (appId: string) => {
    dispatch({ type: "SHOW_DELETE_CONFIRM", payload: appId });
  };

  const handleDeleteCancel = () => {
    dispatch({ type: "HIDE_DELETE_CONFIRM" });
  };

  const handleDeleteConfirm = () => {
    if (state.applicationToDelete) {
      handleDeleteApplication(state.applicationToDelete);
    }
  };

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast("Copied to clipboard", "copy");
  };

  const handleEditedContentChange = (content: string) => {
    dispatch({ type: "SET_EDITED_CONTENT", payload: content });
  };

  const handleCloseGoalAchievement = () => {
    dispatch({ type: "HIDE_GOAL_ACHIEVEMENT" });
  };

  return {
    state,
    actions: {
      handleCardClick,
      handleModalClose,
      handleSaveChanges,
      handleSaveAndCloseWithToast,
      handleDeleteClick,
      handleDeleteCancel,
      handleDeleteConfirm,
      handleCopyToClipboard,
      handleEditedContentChange,
      handleCloseGoalAchievement,
    },
  };
}
