import { copyToClipboard } from "../utils/applicationOperations";
import { useModalActions } from "./useModalActions";
import { ToastType } from "@/types";

export const useContentActions = (
  showToast: (message: string, type?: ToastType) => void
) => {
  const { handleSaveChanges } = useModalActions();

  const handleSaveAndCloseWithToast = async () => {
    await handleSaveChanges();
    await new Promise((resolve) => setTimeout(resolve, 100));
    showToast("Changes saved successfully!", "save");
  };

  const handleCopyToClipboard = async (content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      showToast("Copied to clipboard!", "copy");
    } else {
      showToast("Failed to copy. Please try again.", "error");
    }
  };

  return {
    handleSaveAndCloseWithToast,
    handleCopyToClipboard,
  };
};
