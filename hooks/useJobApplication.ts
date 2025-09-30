import { useEffect, useReducer, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";
import { localStorageService } from "@/lib/localStorage";

type JobApplicationState = {
  jobTitle: string;
  company: string;
  skills: string;
  additionalDetails: string;
  generatedApplication: string;
  titleText: string;
  isGenerating: boolean;
  applicationsCount: number;
  savedApplicationId: string;
  isCountLoaded: boolean;
  progressHighlightColor?: "positive" | "negative";
};

type JobApplicationAction =
  | { type: "SET_JOB_TITLE"; payload: string }
  | { type: "SET_COMPANY"; payload: string }
  | { type: "SET_SKILLS"; payload: string }
  | { type: "SET_ADDITIONAL_DETAILS"; payload: string }
  | { type: "SET_GENERATED_APPLICATION"; payload: string }
  | { type: "SET_TITLE_TEXT"; payload: string }
  | { type: "SET_IS_GENERATING"; payload: boolean }
  | { type: "SET_APPLICATIONS_COUNT"; payload: number }
  | { type: "SET_SAVED_APPLICATION_ID"; payload: string }
  | { type: "SET_COUNT_LOADED"; payload: boolean }
  | {
      type: "SET_PROGRESS_HIGHLIGHT_COLOR";
      payload: "positive" | "negative";
    }
  | { type: "RESET_FORM" }
  | { type: "CLEAR_FORM_ONLY" };

function jobApplicationReducer(
  state: JobApplicationState,
  action: JobApplicationAction
): JobApplicationState {
  switch (action.type) {
    case "SET_JOB_TITLE":
      return { ...state, jobTitle: action.payload };
    case "SET_COMPANY":
      return { ...state, company: action.payload };
    case "SET_SKILLS":
      return { ...state, skills: action.payload };
    case "SET_ADDITIONAL_DETAILS":
      return { ...state, additionalDetails: action.payload };
    case "SET_GENERATED_APPLICATION":
      return { ...state, generatedApplication: action.payload };
    case "SET_TITLE_TEXT":
      return { ...state, titleText: action.payload };
    case "SET_IS_GENERATING":
      return { ...state, isGenerating: action.payload };
    case "SET_APPLICATIONS_COUNT":
      return { ...state, applicationsCount: action.payload };
    case "SET_SAVED_APPLICATION_ID":
      return { ...state, savedApplicationId: action.payload };
    case "SET_COUNT_LOADED":
      return { ...state, isCountLoaded: action.payload };
    case "SET_PROGRESS_HIGHLIGHT_COLOR":
      return { ...state, progressHighlightColor: action.payload };
    case "RESET_FORM":
      return {
        ...state,
        jobTitle: "",
        company: "",
        skills: "",
        additionalDetails: "",
        generatedApplication: "",
        titleText: "New application",
      };
    case "CLEAR_FORM_ONLY":
      return {
        ...state,
        jobTitle: "",
        company: "",
        skills: "",
        additionalDetails: "",
        generatedApplication: "",
        titleText: "New application",
      };
    default:
      return state;
  }
}

export function useJobApplication(initialApplicationsCount: number = 0) {
  const initialState: JobApplicationState = {
    jobTitle: "",
    company: "",
    skills: "",
    additionalDetails: "",
    generatedApplication: "",
    titleText: "New application",
    isGenerating: false,
    applicationsCount: initialApplicationsCount,
    savedApplicationId: "",
    isCountLoaded: true,
    progressHighlightColor: undefined,
  };

  const [state, dispatch] = useReducer(jobApplicationReducer, initialState);
  const { showToast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const updateTitleFromFields = () => {
    if (!state.jobTitle.trim() && !state.company.trim()) {
      dispatch({ type: "SET_TITLE_TEXT", payload: "New application" });
      return;
    }

    const parts = [];
    if (state.jobTitle.trim()) {
      parts.push(state.jobTitle.trim());
    }
    if (state.company.trim()) {
      parts.push(state.company.trim());
    }

    dispatch({ type: "SET_TITLE_TEXT", payload: parts.join(", ") });
  };

  const getTitleClassName = (styles: Record<string, string>) => {
    if (state.titleText === "New application") {
      return `${styles.title} ${styles.titlePlaceholder}`;
    }
    return styles.title;
  };

  const isGenerateDisabled = () => {
    return (
      !state.jobTitle.trim() ||
      !state.company.trim() ||
      !state.skills.trim() ||
      !state.additionalDetails.trim() ||
      state.additionalDetails.length > 1200 ||
      state.isGenerating
    );
  };

  const autoSaveApplication = async (content: string) => {
    const application = {
      id: Date.now().toString(),
      title: state.titleText,
      company: state.company,
      jobTitle: state.jobTitle,
      content: content,
      createdAt: new Date().toISOString(),
    };

    try {
      if (state.savedApplicationId) {
        localStorageService.deleteApplication(state.savedApplicationId);
      }

      const updatedApplications =
        localStorageService.addApplication(application);
      dispatch({ type: "SET_SAVED_APPLICATION_ID", payload: application.id });
      const previousCount = state.applicationsCount;
      dispatch({
        type: "SET_APPLICATIONS_COUNT",
        payload: updatedApplications.length,
      });

      if (updatedApplications.length === 5 && previousCount < 5) {
        sessionStorage.setItem("justReached5Applications", "true");
      }

      window.dispatchEvent(new CustomEvent("applicationsUpdated"));
    } catch (error) {
      console.error("Error saving application:", error);
    }
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

      showToast("Application generated successfully!", "save");
      setTimeout(() => autoSaveApplication(data.coverLetter), 100);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was cancelled");
        return;
      }

      console.error("Error generating cover letter:", error);
      const fallbackApplication = `Dear Hiring Manager at ${
        state.company || "your company"
      },

I am writing to express my interest in the ${
        state.jobTitle || "position"
      } role. With my expertise in ${
        state.skills || "various technologies"
      }, I believe I would be a valuable addition to your team.

${state.additionalDetails}

Thank you for considering my application.

Best regards,
Your Name`;
      dispatch({
        type: "SET_GENERATED_APPLICATION",
        payload: fallbackApplication,
      });

      showToast("Application generated with fallback template", "save");
      setTimeout(() => autoSaveApplication(fallbackApplication), 100);
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

    if (state.savedApplicationId) {
      try {
        const updatedApplications = localStorageService.deleteApplication(
          state.savedApplicationId
        );
        dispatch({
          type: "SET_APPLICATIONS_COUNT",
          payload: updatedApplications.length,
        });
        dispatch({ type: "SET_SAVED_APPLICATION_ID", payload: "" });
        window.dispatchEvent(new CustomEvent("applicationsUpdated"));
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
    dispatch({ type: "SET_GENERATED_APPLICATION", payload: "" });
  };

  const handleGenerateNext = () => {
    dispatch({ type: "CLEAR_FORM_ONLY" });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(state.generatedApplication);
    showToast("Copied to clipboard", "copy");
  };

  const handleCreateNew = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const handleJobTitleChange = (value: string) => {
    dispatch({ type: "SET_JOB_TITLE", payload: value });
  };

  const handleCompanyChange = (value: string) => {
    dispatch({ type: "SET_COMPANY", payload: value });
  };

  const handleSkillsChange = (value: string) => {
    dispatch({ type: "SET_SKILLS", payload: value });
  };

  const handleAdditionalDetailsChange = (value: string) => {
    dispatch({ type: "SET_ADDITIONAL_DETAILS", payload: value });
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
    },
  };
}
