import { applicationsActions } from "@/store/applications";
import {
  useSetGeneratedApplication,
  useSavedApplicationId,
  useSetSavedApplicationId,
  useClearFormOnly,
  useClearAll,
} from "@/store/jobApplication";
import { deleteApplication } from "../utils";

export const useApplicationActions = () => {
  const setGeneratedApplication = useSetGeneratedApplication();
  const savedApplicationId = useSavedApplicationId();
  const setSavedApplicationId = useSetSavedApplicationId();
  const clearFormOnly = useClearFormOnly();
  const clearAll = useClearAll();

  const handleTryAgain = async () => {
    applicationsActions.triggerHighlight("negative");
    await deleteApplication(savedApplicationId, setSavedApplicationId);
    setGeneratedApplication("");
  };

  const handleGenerateNext = () => {
    clearFormOnly();
  };

  const handleCreateNew = (reset: () => void) => {
    reset();
    clearAll();
  };

  return {
    handleTryAgain,
    handleGenerateNext,
    handleCreateNew,
  };
};
