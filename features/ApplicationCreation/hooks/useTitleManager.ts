import { useCallback } from "react";
import { UI_MESSAGES } from "@/constants/ai";
import type { JobApplicationState, JobApplicationAction } from "../types";

export function useTitleManager(
  state: JobApplicationState,
  dispatch: React.Dispatch<JobApplicationAction>
) {
  const updateTitleFromFields = useCallback(() => {
    if (!state.jobTitle.trim() && !state.company.trim()) {
      dispatch({ type: "SET_TITLE_TEXT", payload: UI_MESSAGES.newApplication });
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
  }, [state.jobTitle, state.company, dispatch]);

  const getTitleClassName = useCallback(
    (styles: Record<string, string>) => {
      if (state.titleText === UI_MESSAGES.newApplication) {
        return `title-primary ${styles.title} ${styles.titlePlaceholder}`;
      }
      return `title-primary ${styles.title}`;
    },
    [state.titleText]
  );

  return {
    updateTitleFromFields,
    getTitleClassName,
  };
}
