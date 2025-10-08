import {
  applicationsActions,
  useSelectedApplication,
  useEditedContent,
} from "@/store/applications";
import { SavedApplication } from "@/types";
import { updateApplicationContent } from "../utils/applicationOperations";

export const useModalActions = () => {
  const selectedApplication = useSelectedApplication();
  const editedContent = useEditedContent();

  const handleCardClick = (app: SavedApplication) => {
    applicationsActions.openModal(app);
  };

  const handleModalClose = () => {
    applicationsActions.closeModal();
  };

  const handleSaveChanges = async () => {
    if (selectedApplication) {
      updateApplicationContent(selectedApplication.id, editedContent);
    }
    handleModalClose();
  };

  const handleEditedContentChange = (content: string) => {
    applicationsActions.setEditedContent(content);
  };

  return {
    handleCardClick,
    handleModalClose,
    handleSaveChanges,
    handleEditedContentChange,
  };
};
