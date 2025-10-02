import { UI_MESSAGES, AI_PROMPTS } from "@/constants/ai";
import type { ToastType } from "@/types";

export const createCoverLetterRequest = (
  formData: {
    jobTitle: string;
    company: string;
    skills: string;
    additionalDetails: string;
  },
  abortController: AbortController
) => {
  return fetch("/api/generate-cover-letter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    signal: abortController.signal,
  });
};

export const handleGenerationSuccess = async ({
  coverLetter,
  onGeneratedApplicationChange,
  showToast,
  autoSaveApplication,
}: {
  coverLetter: string;
  onGeneratedApplicationChange: (coverLetter: string) => void;
  showToast: (message: string, type?: ToastType) => void;
  autoSaveApplication: (content: string) => Promise<void>;
}) => {
  onGeneratedApplicationChange(coverLetter);
  showToast(UI_MESSAGES.toasts.generatedSuccessfully, "save");
  await new Promise((resolve) => setTimeout(resolve, 100));
  await autoSaveApplication(coverLetter);
};

export const handleGenerationError = async ({
  error,
  onGeneratedApplicationChange,
  showToast,
  autoSaveApplication,
}: {
  error: unknown;
  onGeneratedApplicationChange: (coverLetter: string) => void;
  showToast: (message: string, type?: ToastType) => void;
  autoSaveApplication: (content: string) => Promise<void>;
}) => {
  if (!(error instanceof Error && error.name === "AbortError")) {
    console.error("Generation error:", error);
  }

  const fallbackApplication = AI_PROMPTS.fallbackTemplate("", "", "", "");
  onGeneratedApplicationChange(fallbackApplication);
  showToast(UI_MESSAGES.toasts.generatedWithFallback, "save");
  await new Promise((resolve) => setTimeout(resolve, 100));
  await autoSaveApplication(fallbackApplication);
};
