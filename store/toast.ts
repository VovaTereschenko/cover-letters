import { create } from "zustand";
import { ToastSlice, createToastSlice } from "./slices/toastSlice";

export const useToastStore = create<ToastSlice>()(createToastSlice);

export const useToastMessage = () => useToastStore((state) => state.message);
export const useToastVisible = () =>
  useToastStore((state) => state.shouldRender);
export const useToastShow = () => useToastStore((state) => state.show);
export const useToastType = () => useToastStore((state) => state.type);

export const useToastShowToast = () =>
  useToastStore((state) => state.showToast);
export const useToastHideToast = () =>
  useToastStore((state) => state.hideToast);
export const useToastStartShowAnimation = () =>
  useToastStore((state) => state.startShowAnimation);
export const useToastStartHideAnimation = () =>
  useToastStore((state) => state.startHideAnimation);
export const useToastCleanupToast = () =>
  useToastStore((state) => state.cleanupToast);
