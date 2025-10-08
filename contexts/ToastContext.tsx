"use client";

import { createContext, useContext, ReactNode, useRef } from "react";
import { Toast } from "@/components/shared/Toast";
import { ToastType } from "@/types";
import {
  useToastMessage,
  useToastVisible,
  useToastShow,
  useToastShowToast,
  useToastHideToast,
  useToastStartShowAnimation,
  useToastStartHideAnimation,
  useToastCleanupToast,
} from "@/store/toast";

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const message = useToastMessage();
  const shouldRender = useToastVisible();
  const show = useToastShow();
  const showToastAction = useToastShowToast();
  const hideToastAction = useToastHideToast();
  const startShowAnimation = useToastStartShowAnimation();
  const startHideAnimation = useToastStartHideAnimation();
  const cleanupToast = useToastCleanupToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: ToastType = "copy") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    showToastAction(message, type);

    requestAnimationFrame(() => {
      startShowAnimation();
    });

    timeoutRef.current = setTimeout(async () => {
      startHideAnimation();
      await new Promise((resolve) => setTimeout(resolve, 0));
      hideToastAction();
      await new Promise((resolve) => setTimeout(resolve, 300));
      cleanupToast();
    }, 2000);
  };

  const hideToast = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    startHideAnimation();
    await new Promise((resolve) => setTimeout(resolve, 0));
    hideToastAction();
    await new Promise((resolve) => setTimeout(resolve, 300));
    cleanupToast();
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={message}
        isVisible={shouldRender}
        show={show}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};
