import type { JobApplicationState, JobApplicationAction } from "../types";
import {
  updateTitleFromFields as updateTitleFromFieldsUtility,
  getTitleClassName as getTitleClassNameUtility,
} from "../utils/titleManagement";

export function useTitleManager(
  state: JobApplicationState,
  dispatch: React.Dispatch<JobApplicationAction>
) {
  const updateTitleFromFields = () => {
    updateTitleFromFieldsUtility(state.jobTitle, state.company, dispatch);
  };

  const getTitleClassName = (styles: Record<string, string>) => {
    return getTitleClassNameUtility(state.titleText, styles);
  };

  return {
    updateTitleFromFields,
    getTitleClassName,
  };
}
