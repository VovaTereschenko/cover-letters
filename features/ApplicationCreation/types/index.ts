import { ProgressHighlightColor } from "@/types";

export type JobApplicationState = {
  generatedApplication: string;
  titleText: string;
  isGenerating: boolean;
  applicationsCount: number;
  savedApplicationId: string;
  isCountLoaded: boolean;
  progressHighlightColor?: ProgressHighlightColor;
};

export type JobApplicationAction =
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
  | { type: "RESET_FORM" }
  | { type: "CLEAR_FORM_ONLY" };
