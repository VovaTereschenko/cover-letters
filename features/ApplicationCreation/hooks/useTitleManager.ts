import type { JobApplicationState, JobApplicationAction } from "../types";
import {
  updateTitleFromFields as updateTitleFromFieldsUtil,
  getTitleClassName as getTitleClassNameUtil,
} from "../utils/titleManagement";

export function useTitleManager(
  state: JobApplicationState,
  dispatch: React.Dispatch<JobApplicationAction>
) {
  const updateTitleFromFields = () => {
    updateTitleFromFieldsUtil(state.jobTitle, state.company, dispatch);
  };

  const getTitleClassName = (styles: Record<string, string>) => {
    return getTitleClassNameUtil(state.titleText, styles);
  };

  return {
    updateTitleFromFields,
    getTitleClassName,
  };
}
