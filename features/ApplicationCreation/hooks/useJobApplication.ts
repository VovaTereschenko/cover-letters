import { useReducer, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { UI_MESSAGES } from "@/constants/ai";
import type { JobApplicationState } from "../types";
import { jobApplicationReducer } from "./jobApplicationReducer";
import { useJobApplicationForm } from "./useJobApplicationForm";
import { createApplicationStorageHelpers } from "../utils/applicationStorageHelpers";
import { useApplicationsCountSync, useNavigationCleanup } from "@/hooks/shared";
import {
  createCoverLetterRequest,
  handleGenerationSuccess,
  handleGenerationError,
} from "../utils/coverLetterGeneration";

export function useJobApplication(initialApplicationsCount: number = 0) {
  const initialState: JobApplicationState = {
    generatedApplication: "",
    titleText: UI_MESSAGES.newApplication,
    isGenerating: false,
    applicationsCount: initialApplicationsCount,
    savedApplicationId: "",
    isCountLoaded: true,
    progressHighlightColor: undefined,
  };

  const [state, dispatch] = useReducer(jobApplicationReducer, initialState);
  const { showToast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const form = useJobApplicationForm();
  const { watch, formState, reset, trigger } = form;
  const formValues = watch();

  useEffect(() => {
    if (!formValues.jobTitle.trim() && !formValues.company.trim()) {
      dispatch({ type: "SET_TITLE_TEXT", payload: UI_MESSAGES.newApplication });
      return;
    }

    const parts = [];
    if (formValues.jobTitle.trim()) {
      parts.push(formValues.jobTitle.trim());
    }
    if (formValues.company.trim()) {
      parts.push(formValues.company.trim());
    }

    dispatch({ type: "SET_TITLE_TEXT", payload: parts.join(", ") });
  }, [formValues.jobTitle, formValues.company]);

  const { autoSaveApplication, deleteSavedApplication } =
    createApplicationStorageHelpers({
      titleText: state.titleText,
      company: formValues.company,
      jobTitle: formValues.jobTitle,
      applicationsCount: state.applicationsCount,
      savedApplicationId: state.savedApplicationId,
      onSavedApplicationIdChange: (id: string) => {
        dispatch({ type: "SET_SAVED_APPLICATION_ID", payload: id });
      },
      onApplicationsCountChange: (count: number) => {
        dispatch({ type: "SET_APPLICATIONS_COUNT", payload: count });
      },
    });

  const handleCountChange = useCallback((count: number) => {
    dispatch({ type: "SET_APPLICATIONS_COUNT", payload: count });
  }, []);

  const handleSetIsGenerating = useCallback(() => {
    dispatch({ type: "SET_IS_GENERATING", payload: false });
  }, []);

  useApplicationsCountSync({
    initialCount: initialApplicationsCount,
    onCountChange: handleCountChange,
  });

  useNavigationCleanup({
    abortControllerRef,
    onNavigationCleanup: handleSetIsGenerating,
    onBeforeUnload: handleSetIsGenerating,
  });

  const getTitleClassName = (styles: Record<string, string>) => {
    if (state.titleText === UI_MESSAGES.newApplication) {
      return `title-primary ${styles.title} ${styles.titlePlaceholder}`;
    }
    return `title-primary ${styles.title}`;
  };

  const isGenerateDisabled = () => {
    return !formState.isValid || state.isGenerating;
  };

  const setupAbortController = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  };

  const handleGenerate = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    const abortController = setupAbortController();
    dispatch({ type: "SET_IS_GENERATING", payload: true });

    try {
      const formData = {
        jobTitle: formValues.jobTitle,
        company: formValues.company,
        skills: formValues.skills,
        additionalDetails: formValues.additionalDetails,
      };

      const response = await createCoverLetterRequest(
        formData,
        abortController
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate cover letter");
      }

      const data = await response.json();

      await handleGenerationSuccess({
        coverLetter: data.coverLetter,
        onGeneratedApplicationChange: (coverLetter: string) => {
          dispatch({ type: "SET_GENERATED_APPLICATION", payload: coverLetter });
        },
        showToast,
        autoSaveApplication,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      await handleGenerationError({
        error,
        onGeneratedApplicationChange: (coverLetter: string) => {
          dispatch({ type: "SET_GENERATED_APPLICATION", payload: coverLetter });
        },
        showToast,
        autoSaveApplication,
      });
    } finally {
      dispatch({ type: "SET_IS_GENERATING", payload: false });
    }
  };

  const handleTryAgain = async () => {
    window.dispatchEvent(
      new CustomEvent("progressHighlight", {
        detail: { color: "negative" },
      })
    );

    await deleteSavedApplication();
    dispatch({ type: "SET_GENERATED_APPLICATION", payload: "" });
  };

  const handleGenerateNext = () => {
    dispatch({ type: "CLEAR_FORM_ONLY" });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(state.generatedApplication);
    showToast(UI_MESSAGES.toasts.copiedToClipboard, "copy");
  };

  const handleCreateNew = () => {
    reset();
    dispatch({ type: "RESET_FORM" });
  };

  return {
    state,
    form,
    actions: {
      handleGenerate,
      handleTryAgain,
      handleGenerateNext,
      handleCopyToClipboard,
      handleCreateNew,
      getTitleClassName,
      isGenerateDisabled,
    },
  };
}
