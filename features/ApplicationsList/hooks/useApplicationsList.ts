import { useReducer } from "react";
import { useApplicationsCount } from "@/contexts/ApplicationsCountContext";
import { useToast } from "@/contexts/ToastContext";
import { SavedApplication } from "@/types";
import type { ApplicationsState } from "../types";
import { applicationsReducer } from "./applicationsReducer";
import { useApplicationsInitialization } from "./useApplicationsInitialization";
import { useGoalAchievementTracking } from "./useGoalAchievementTracking";
import { useSessionGoalCheck } from "./useSessionGoalCheck";
import {
  updateApplicationContent,
  deleteApplication,
  copyToClipboard,
} from "../utils/applicationOperations";

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

  useApplicationsInitialization(
    initialApplications,
    dispatch,
    setApplicationsCount
  );
  useGoalAchievementTracking(
    state.applications.length,
    state.previousCount,
    dispatch
  );
  useSessionGoalCheck(initialApplications.length, dispatch);

  const handleCardClick = (app: SavedApplication) => {
    dispatch({ type: "OPEN_MODAL", payload: { application: app } });
  };

  const handleModalClose = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const handleSaveChanges = async () => {
    if (state.selectedApplication) {
      await updateApplicationContent({
        applicationId: state.selectedApplication.id,
        content: state.editedContent,
        dispatch,
        setApplicationsCount,
      });
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
    await deleteApplication({
      applicationId: appId,
      dispatch,
      setApplicationsCount,
      showToast,
    });
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
    copyToClipboard({
      content,
      showToast,
    });
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
