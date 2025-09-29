"use client";

import { createContext, useContext, ReactNode, useReducer } from "react";
import { Toast } from "@/components/shared/Toast";

type ToastType = "copy" | "save" | "delete" | "error";

type ToastState = {
  isVisible: boolean;
  message: string;
  type: ToastType;
};

type ToastAction =
  | { type: "SHOW_TOAST"; payload: { message: string; toastType: ToastType } }
  | { type: "HIDE_TOAST" };

const initialState: ToastState = {
  isVisible: false,
  message: "",
  type: "copy",
};

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "SHOW_TOAST":
      return {
        isVisible: true,
        message: action.payload.message,
        type: action.payload.toastType,
      };
    case "HIDE_TOAST":
      return {
        ...state,
        isVisible: false,
      };
    default:
      return state;
  }
}

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
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const showToast = (message: string, type: ToastType = "copy") => {
    dispatch({ type: "SHOW_TOAST", payload: { message, toastType: type } });
  };

  const hideToast = () => {
    dispatch({ type: "HIDE_TOAST" });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={state.message}
        isVisible={state.isVisible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};
