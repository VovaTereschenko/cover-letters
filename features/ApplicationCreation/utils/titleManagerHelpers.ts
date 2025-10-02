import type { JobApplicationState, JobApplicationAction } from "../types";
import { updateTitleFromFields, getTitleClassName } from "./titleManagement";

export function createTitleManagerHelpers({
  state,
  dispatch,
}: {
  state: JobApplicationState;
  dispatch: React.Dispatch<JobApplicationAction>;
}) {
  const updateTitle = () => {
    updateTitleFromFields(state.jobTitle, state.company, (title: string) => {
      dispatch({ type: "SET_TITLE_TEXT", payload: title });
    });
  };

  const getClassName = (styles: Record<string, string>) => {
    return getTitleClassName(state.titleText, styles);
  };

  return {
    updateTitleFromFields: updateTitle,
    getTitleClassName: getClassName,
  };
}
