"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useRef,
} from "react";
import { Toast } from "@/components/shared/Toast";

type ToastType = "copy" | "save" | "delete" | "error";

type ToastState = {
  isVisible: boolean;
  message: string;
  type: ToastType;
  show: boolean;
  shouldRender: boolean;
};

type ToastAction =
  | { type: "SHOW_TOAST"; payload: { message: string; toastType: ToastType } }
  | { type: "HIDE_TOAST" }
  | { type: "START_SHOW_ANIMATION" }
  | { type: "START_HIDE_ANIMATION" }
  | { type: "CLEANUP_TOAST" };

const initialState: ToastState = {
  isVisible: false,
  message: "",
  type: "copy",
  show: false,
  shouldRender: false,
};

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "SHOW_TOAST":
      return {
        isVisible: true,
        message: action.payload.message,
        type: action.payload.toastType,
        show: false,
        shouldRender: true,
      };
    case "START_SHOW_ANIMATION":
      return {
        ...state,
        show: true,
      };
    case "START_HIDE_ANIMATION":
      return {
        ...state,
        show: false,
      };
    case "HIDE_TOAST":
      return {
        ...state,
        isVisible: false,
      };
    case "CLEANUP_TOAST":
      return {
        ...state,
        shouldRender: false,
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: ToastType = "copy") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    dispatch({ type: "SHOW_TOAST", payload: { message, toastType: type } });

    requestAnimationFrame(() => {
      dispatch({ type: "START_SHOW_ANIMATION" });
    });

    timeoutRef.current = setTimeout(() => {
      dispatch({ type: "START_HIDE_ANIMATION" });
      setTimeout(() => {
        dispatch({ type: "HIDE_TOAST" });
        setTimeout(() => {
          dispatch({ type: "CLEANUP_TOAST" });
        }, 300);
      }, 0);
    }, 2000);
  };

  const hideToast = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    dispatch({ type: "START_HIDE_ANIMATION" });
    setTimeout(() => {
      dispatch({ type: "HIDE_TOAST" });
      setTimeout(() => {
        dispatch({ type: "CLEANUP_TOAST" });
      }, 300);
    }, 0);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={state.message}
        isVisible={state.shouldRender}
        show={state.show}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};
