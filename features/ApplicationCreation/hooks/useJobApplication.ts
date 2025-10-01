import { useEffect, useReducer, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";
import { localStorageService } from "@/lib/localStorage";
import { UI_MESSAGES, AI_PROMPTS } from "@/constants/ai";
import type { JobApplicationState } from "../types";
import { jobApplicationReducer } from "./jobApplicationReducer";
import { useFormValidation } from "./useFormValidation";
import { useTitleManager } from "./useTitleManager";
import { useApplicationStorage } from "./useApplicationStorage";

export function useJobApplication(initialApplicationsCount: number = 0) {
  const initialState: JobApplicationState = {
    jobTitle: "",
    company: "",
    skills: "",
    additionalDetails: "",
    generatedApplication: "",
    titleText: UI_MESSAGES.newApplication,
    isGenerating: false,
    applicationsCount: initialApplicationsCount,
    savedApplicationId: "",
    isCountLoaded: true,
    progressHighlightColor: undefined,
    validationErrors: {},
  };

  const [state, dispatch] = useReducer(jobApplicationReducer, initialState);
  const { showToast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const { handleFieldValidation, isFormValid, getFieldError, hasFieldError } =
    useFormValidation(state, dispatch);
  const { updateTitleFromFields, getTitleClassName } = useTitleManager(
    state,
    dispatch
  );
  const { autoSaveApplication, deleteSavedApplication } = useApplicationStorage(
    state,
    dispatch
  );

  useEffect(() => {
    const applications = localStorageService.getApplications();
    const actualCount = applications.length;

    if (actualCount !== initialApplicationsCount) {
      dispatch({ type: "SET_APPLICATIONS_COUNT", payload: actualCount });
    }
  }, [initialApplicationsCount]);

  useEffect(() => {
    const handleNavigation = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        dispatch({ type: "SET_IS_GENERATING", payload: false });
      }
    };

    const handleBeforeUnload = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

    window.addEventListener("navigationStarted", handleNavigation);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("navigationStarted", handleNavigation);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      const controller = abortControllerRef.current;
      if (controller) {
        controller.abort();
      }
    };
  }, []);

  const isGenerateDisabled = () => {
    return !isFormValid() || state.isGenerating;
  };

  const handleGenerate = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    dispatch({ type: "SET_IS_GENERATING", payload: true });

    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: state.jobTitle,
          company: state.company,
          skills: state.skills,
          additionalDetails: state.additionalDetails,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate cover letter");
      }

      const data = await response.json();

      dispatch({
        type: "SET_GENERATED_APPLICATION",
        payload: data.coverLetter,
      });

      showToast(UI_MESSAGES.toasts.generatedSuccessfully, "save");
      setTimeout(
        () =>
          autoSaveApplication(data.coverLetter, () => state.savedApplicationId),
        100
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was cancelled");
        return;
      }

      console.error("Error generating cover letter:", error);
      const fallbackApplication = AI_PROMPTS.fallbackTemplate(
        state.company,
        state.jobTitle,
        state.skills,
        state.additionalDetails
      );
      dispatch({
        type: "SET_GENERATED_APPLICATION",
        payload: fallbackApplication,
      });

      showToast(UI_MESSAGES.toasts.generatedWithFallback, "save");
      setTimeout(
        () =>
          autoSaveApplication(
            fallbackApplication,
            () => state.savedApplicationId
          ),
        100
      );
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

    await deleteSavedApplication(() => state.savedApplicationId);
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
    dispatch({ type: "RESET_FORM" });
  };

  // Field change handlers
  const handleJobTitleChange = (value: string) => {
    dispatch({ type: "SET_JOB_TITLE", payload: value });
    handleFieldValidation("jobTitle", value);
  };

  const handleCompanyChange = (value: string) => {
    dispatch({ type: "SET_COMPANY", payload: value });
    handleFieldValidation("company", value);
  };

  const handleSkillsChange = (value: string) => {
    dispatch({ type: "SET_SKILLS", payload: value });
    handleFieldValidation("skills", value);
  };

  const handleAdditionalDetailsChange = (value: string) => {
    dispatch({ type: "SET_ADDITIONAL_DETAILS", payload: value });
    handleFieldValidation("additionalDetails", value);
  };

  const handleJobTitleBlur = () => {
    updateTitleFromFields();
  };

  const handleCompanyBlur = () => {
    updateTitleFromFields();
  };

  return {
    state,
    actions: {
      handleJobTitleChange,
      handleCompanyChange,
      handleSkillsChange,
      handleAdditionalDetailsChange,
      handleJobTitleBlur,
      handleCompanyBlur,
      handleGenerate,
      handleTryAgain,
      handleGenerateNext,
      handleCopyToClipboard,
      handleCreateNew,
      getTitleClassName,
      isGenerateDisabled,
      getFieldError,
      hasFieldError,
    },
  };
}
