import { UI_MESSAGES } from "@/constants/ai";
import type { JobApplicationState, JobApplicationAction } from "../types";

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

const EMPTY_FORM = {
  generatedApplication: "",
  titleText: UI_MESSAGES.newApplication,
};

export function jobApplicationReducer(
  state: JobApplicationState,
  action: JobApplicationAction
): JobApplicationState {
  switch (action.type) {
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
        ...EMPTY_FORM,
      };
    case "CLEAR_FORM_ONLY":
      return {
        ...state,
        ...EMPTY_FORM,
        savedApplicationId: "",
      };
    default:
      return assertNever(action);
  }
}
