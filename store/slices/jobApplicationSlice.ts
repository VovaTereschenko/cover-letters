import { StateCreator } from "zustand";
import { UI_MESSAGES } from "@/constants/ai";
import type { HighlightColor } from "@/types";

export interface JobApplicationSlice {
  generatedApplication: string;
  titleText: string;
  isGenerating: boolean;
  applicationsCount: number;
  savedApplicationId: string;
  progressHighlightColor?: HighlightColor;

  setGeneratedApplication: (application: string) => void;
  setTitleText: (title: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setApplicationsCount: (count: number) => void;
  setSavedApplicationId: (id: string) => void;
  setProgressHighlightColor: (color?: HighlightColor) => void;
  clearFormOnly: () => void;
  clearAll: () => void;
}

export const createJobApplicationSlice: StateCreator<
  JobApplicationSlice,
  [],
  [],
  JobApplicationSlice
> = (set) => ({
  generatedApplication: "",
  titleText: UI_MESSAGES.newApplication,
  isGenerating: false,
  applicationsCount: 0,
  savedApplicationId: "",
  progressHighlightColor: undefined,

  setGeneratedApplication: (application: string) => {
    set({ generatedApplication: application });
  },

  setTitleText: (title: string) => {
    set({ titleText: title });
  },

  setIsGenerating: (isGenerating: boolean) => {
    set({ isGenerating });
  },

  setApplicationsCount: (count: number) => {
    set({ applicationsCount: count });
  },

  setSavedApplicationId: (id: string) => {
    set({ savedApplicationId: id });
  },

  setProgressHighlightColor: (color?: HighlightColor) => {
    set({ progressHighlightColor: color });
  },

  clearFormOnly: () => {
    set({
      generatedApplication: "",
      titleText: UI_MESSAGES.newApplication,
      savedApplicationId: "",
      progressHighlightColor: undefined,
    });
  },

  clearAll: () => {
    set({
      generatedApplication: "",
      titleText: UI_MESSAGES.newApplication,
      isGenerating: false,
      savedApplicationId: "",
      progressHighlightColor: undefined,
    });
  },
});
