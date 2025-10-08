import { create } from "zustand";
import {
  JobApplicationSlice,
  createJobApplicationSlice,
} from "./slices/jobApplicationSlice";

export const useJobApplicationStore = create<JobApplicationSlice>()(
  createJobApplicationSlice
);

// тут и в других местах нужно экпортировать отдельно для производительности
export const useGeneratedApplication = () =>
  useJobApplicationStore((state) => state.generatedApplication);
export const useTitleText = () =>
  useJobApplicationStore((state) => state.titleText);
export const useIsGenerating = () =>
  useJobApplicationStore((state) => state.isGenerating);
export const useJobApplicationsCount = () =>
  useJobApplicationStore((state) => state.applicationsCount);
export const useSavedApplicationId = () =>
  useJobApplicationStore((state) => state.savedApplicationId);
export const useProgressHighlightColor = () =>
  useJobApplicationStore((state) => state.progressHighlightColor);

export const useSetGeneratedApplication = () =>
  useJobApplicationStore((state) => state.setGeneratedApplication);
export const useSetTitleText = () =>
  useJobApplicationStore((state) => state.setTitleText);
export const useSetIsGenerating = () =>
  useJobApplicationStore((state) => state.setIsGenerating);
export const useSetApplicationsCount = () =>
  useJobApplicationStore((state) => state.setApplicationsCount);
export const useSetSavedApplicationId = () =>
  useJobApplicationStore((state) => state.setSavedApplicationId);
export const useSetProgressHighlightColor = () =>
  useJobApplicationStore((state) => state.setProgressHighlightColor);
export const useClearFormOnly = () =>
  useJobApplicationStore((state) => state.clearFormOnly);
export const useClearAll = () =>
  useJobApplicationStore((state) => state.clearAll);
