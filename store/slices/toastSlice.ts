import { StateCreator } from "zustand";
import { ToastType } from "@/types";

export interface ToastSlice {
  isVisible: boolean;
  message: string;
  type: ToastType;
  show: boolean;
  shouldRender: boolean;

  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
  startShowAnimation: () => void;
  startHideAnimation: () => void;
  cleanupToast: () => void;
}

export const createToastSlice: StateCreator<ToastSlice, [], [], ToastSlice> = (
  set
) => ({
  isVisible: false,
  message: "",
  type: "copy",
  show: false,
  shouldRender: false,

  showToast: (message: string, type: ToastType) => {
    set({
      isVisible: true,
      message,
      type,
      show: false,
      shouldRender: true,
    });
  },

  startShowAnimation: () => {
    set({ show: true });
  },

  startHideAnimation: () => {
    set({ show: false });
  },

  hideToast: () => {
    set({ isVisible: false });
  },

  cleanupToast: () => {
    set({ shouldRender: false });
  },
});
