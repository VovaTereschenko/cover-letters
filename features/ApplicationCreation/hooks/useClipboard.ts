import { useToast } from "@/contexts/ToastContext";
import { UI_MESSAGES } from "@/constants/ai";

export const useClipboard = () => {
  const { showToast } = useToast();

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(UI_MESSAGES.toasts.copiedToClipboard, "copy");
  };

  return { handleCopyToClipboard };
};
