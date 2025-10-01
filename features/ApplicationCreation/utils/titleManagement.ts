import { UI_MESSAGES } from "@/constants/ai";
import type { JobApplicationAction } from "../types";

export const updateTitleFromFields = (
  jobTitle: string,
  company: string,
  dispatch: React.Dispatch<JobApplicationAction>
) => {
  if (!jobTitle.trim() && !company.trim()) {
    dispatch({ type: "SET_TITLE_TEXT", payload: UI_MESSAGES.newApplication });
    return;
  }

  const parts = [];
  if (jobTitle.trim()) {
    parts.push(jobTitle.trim());
  }
  if (company.trim()) {
    parts.push(company.trim());
  }

  dispatch({ type: "SET_TITLE_TEXT", payload: parts.join(", ") });
};

export const getTitleClassName = (
  titleText: string,
  styles: Record<string, string>
) => {
  if (titleText === UI_MESSAGES.newApplication) {
    return `title-primary ${styles.title} ${styles.titlePlaceholder}`;
  }
  return `title-primary ${styles.title}`;
};
