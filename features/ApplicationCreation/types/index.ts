import { ProgressHighlightColor } from "@/types";
import { JobApplicationFormData } from "@/lib/validations";

export type JobApplicationState = {
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
  progressHighlightColor?: ProgressHighlightColor;
  validationErrors: Partial<Record<keyof JobApplicationFormData, string>>;
};

export type JobApplicationAction =
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
      payload: ProgressHighlightColor;
    }
  | {
      type: "SET_VALIDATION_ERRORS";
      payload: Partial<Record<keyof JobApplicationFormData, string>>;
    }
  | { type: "CLEAR_VALIDATION_ERROR"; payload: keyof JobApplicationFormData }
  | { type: "RESET_FORM" }
  | { type: "CLEAR_FORM_ONLY" };
