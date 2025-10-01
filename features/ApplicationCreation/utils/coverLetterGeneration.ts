import { UI_MESSAGES, AI_PROMPTS } from "@/constants/ai";
import type { JobApplicationAction } from "../types";
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

export const handleSuccessfulGeneration = async ({
  coverLetter,
  dispatch,
  showToast,
  autoSaveApplication,
  getSavedApplicationId,
}: {
  coverLetter: string;
  dispatch: React.Dispatch<JobApplicationAction>;
  showToast: (message: string, type?: ToastType) => void;
  autoSaveApplication: (content: string, getSavedId: () => string) => void;
  getSavedApplicationId: () => string;
}) => {
  dispatch({
    type: "SET_GENERATED_APPLICATION",
    payload: coverLetter,
  });

  showToast(UI_MESSAGES.toasts.generatedSuccessfully, "save");
  setTimeout(
    () => autoSaveApplication(coverLetter, getSavedApplicationId),
    100
  );
};

export const handleGenerationError = async ({
  error,
  formData,
  dispatch,
  showToast,
  autoSaveApplication,
  getSavedApplicationId,
}: {
  error: unknown;
  formData: {
    company: string;
    jobTitle: string;
    skills: string;
    additionalDetails: string;
  };
  dispatch: React.Dispatch<JobApplicationAction>;
  showToast: (message: string, type?: ToastType) => void;
  autoSaveApplication: (content: string, getSavedId: () => string) => void;
  getSavedApplicationId: () => string;
}) => {
  if (error instanceof Error && error.name === "AbortError") {
    console.log("Request was cancelled");
    return;
  }

  const fallbackApplication = AI_PROMPTS.fallbackTemplate(
    formData.company,
    formData.jobTitle,
    formData.skills,
    formData.additionalDetails
  );

  dispatch({
    type: "SET_GENERATED_APPLICATION",
    payload: fallbackApplication,
  });

  showToast(UI_MESSAGES.toasts.generatedWithFallback, "save");
  setTimeout(
    () => autoSaveApplication(fallbackApplication, getSavedApplicationId),
    100
  );
};
