import {
  applicationsActions,
  useApplicationToDelete,
} from "@/store/applications";
import { deleteApplication } from "../utils/applicationOperations";
import { ToastType } from "@/types";

export const useDeleteActions = (
  showToast: (message: string, type?: ToastType) => void
) => {
  const applicationToDelete = useApplicationToDelete();

  const handleDeleteApplication = async (applicationId: string) => {
    deleteApplication(applicationId);
    showToast("Application deleted successfully!", "delete");
    applicationsActions.hideDeleteConfirmDialog();
  };

  const handleDeleteClick = (appId: string) => {
    applicationsActions.showDeleteConfirmDialog(appId);
  };

  const handleDeleteCancel = () => {
    applicationsActions.hideDeleteConfirmDialog();
  };

  const handleDeleteConfirm = () => {
    if (applicationToDelete) {
      handleDeleteApplication(applicationToDelete);
    }
  };

  return {
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
};
