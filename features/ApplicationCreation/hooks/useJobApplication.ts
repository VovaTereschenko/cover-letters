import { useReducer, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";
import { UI_MESSAGES } from "@/constants/ai";
import type { JobApplicationState } from "../types";
import { jobApplicationReducer } from "./jobApplicationReducer";
import { useFormValidation } from "./useFormValidation";
import { useTitleManager } from "./useTitleManager";
import { useApplicationStorage } from "./useApplicationStorage";
import { useApplicationsCountSync } from "./useApplicationsCountSync";
import { useNavigationCleanup } from "./useNavigationCleanup";
import {
  createCoverLetterRequest,
  handleSuccessfulGeneration,
  handleGenerationError,
} from "../utils/coverLetterGeneration";

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

  useApplicationsCountSync(initialApplicationsCount, dispatch);
  useNavigationCleanup(abortControllerRef, dispatch);

  const isGenerateDisabled = () => {
    return !isFormValid() || state.isGenerating;
  };

  const setupAbortController = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  };

  const handleGenerate = async () => {
    const abortController = setupAbortController();
    dispatch({ type: "SET_IS_GENERATING", payload: true });

    try {
      const formData = {
        jobTitle: state.jobTitle,
        company: state.company,
        skills: state.skills,
        additionalDetails: state.additionalDetails,
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
      await handleSuccessfulGeneration({
        coverLetter: data.coverLetter,
        dispatch,
        showToast,
        autoSaveApplication,
        getSavedApplicationId: () => state.savedApplicationId,
      });
    } catch (error) {
      const formData = {
        company: state.company,
        jobTitle: state.jobTitle,
        skills: state.skills,
        additionalDetails: state.additionalDetails,
      };

      await handleGenerationError({
        error,
        formData,
        dispatch,
        showToast,
        autoSaveApplication,
        getSavedApplicationId: () => state.savedApplicationId,
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
