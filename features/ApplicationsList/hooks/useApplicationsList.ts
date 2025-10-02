import { useReducer, useCallback } from "react";
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

  const handleApplicationsChange = useCallback(
    (applications: SavedApplication[]) => {
      dispatch({ type: "SET_APPLICATIONS", payload: applications });
    },
    []
  );

  const handleApplicationsCountChange = useCallback(
    (count: number) => {
      setApplicationsCount(count);
    },
    [setApplicationsCount]
  );

  const handleHydrated = useCallback(() => {
    dispatch({ type: "SET_HYDRATED", payload: true });
  }, []);

  const handleGoalAchieved = useCallback(() => {
    dispatch({ type: "SHOW_GOAL_ACHIEVEMENT" });
  }, []);

  const handleCountUpdate = useCallback((count: number) => {
    dispatch({ type: "SET_PREVIOUS_COUNT", payload: count });
  }, []);

  useApplicationsInitialization({
    onApplicationsChange: handleApplicationsChange,
    onApplicationsCountChange: handleApplicationsCountChange,
    onHydrated: handleHydrated,
  });

  useGoalAchievementTracking({
    applicationsLength: state.applications.length,
    previousCount: state.previousCount,
    onGoalAchieved: handleGoalAchieved,
    onCountUpdate: handleCountUpdate,
  });

  useSessionGoalCheck({
    initialApplicationsLength: initialApplications.length,
    onGoalAchieved: handleGoalAchieved,
  });

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
        onApplicationsChange: (applications) => {
          dispatch({ type: "SET_APPLICATIONS", payload: applications });
        },
        onApplicationsCountChange: (count) => {
          setApplicationsCount(count);
        },
      });
    }
    handleModalClose();
  };

  const handleSaveAndCloseWithToast = async () => {
    await handleSaveChanges();
    await new Promise((resolve) => setTimeout(resolve, 100));
    showToast("Changes saved successfully!", "save");
  };

  const handleDeleteApplication = async (applicationId: string) => {
    await deleteApplication({
      applicationId,
      onApplicationsChange: (applications) => {
        dispatch({ type: "SET_APPLICATIONS", payload: applications });
      },
      onApplicationsCountChange: (count) => {
        setApplicationsCount(count);
      },
      onSuccess: () => {
        showToast("Application deleted successfully!", "delete");
      },
      onError: () => {
        showToast("Failed to delete application. Please try again.", "error");
      },
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
