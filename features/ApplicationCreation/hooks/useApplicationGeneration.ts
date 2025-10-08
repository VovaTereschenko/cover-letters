import { useToast } from "@/contexts/ToastContext";
import {
  useSetGeneratedApplication,
  useSetIsGenerating,
  useSavedApplicationId,
  useSetSavedApplicationId,
} from "@/store/jobApplication";
import { useApplicationsCount } from "@/store/applications";
import {
  createCoverLetterRequest,
  handleGenerationSuccess,
  handleGenerationError,
  saveApplication,
} from "../utils";
import { useAbortController } from "./useAbortController";

interface FormData {
  jobTitle: string;
  company: string;
  skills: string;
  additionalDetails: string;
}

export const useApplicationGeneration = (trigger: () => Promise<boolean>) => {
  const { showToast } = useToast();
  const { setupAbortController } = useAbortController();

  const setGeneratedApplication = useSetGeneratedApplication();
  const setIsGenerating = useSetIsGenerating();
  const savedApplicationId = useSavedApplicationId();
  const setSavedApplicationId = useSetSavedApplicationId();
  const applicationsCount = useApplicationsCount();

  const handleGenerate = async (formData: FormData) => {
    const isValid = await trigger();
    if (!isValid) return;

    const abortController = setupAbortController();
    setIsGenerating(true);

    try {
      const response = await createCoverLetterRequest(
        formData,
        abortController
      );
      const data = await response.json();

      await handleGenerationSuccess({
        coverLetter: data.coverLetter,
        onGeneratedApplicationChange: (coverLetter: string) => {
          setGeneratedApplication(coverLetter);
        },
        showToast,
        autoSaveApplication: (content: string) =>
          saveApplication(
            content,
            formData,
            savedApplicationId,
            applicationsCount,
            setSavedApplicationId
          ),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      await handleGenerationError({
        error,
        onGeneratedApplicationChange: (coverLetter: string) => {
          setGeneratedApplication(coverLetter);
        },
        showToast,
        autoSaveApplication: (content: string) =>
          saveApplication(
            content,
            formData,
            savedApplicationId,
            applicationsCount,
            setSavedApplicationId
          ),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerate };
};
