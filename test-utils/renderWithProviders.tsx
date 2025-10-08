import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ToastProvider } from "@/contexts/ToastContext";
import { setupAllBrowserMocks } from "./mockStorage";
export * from "@testing-library/react";

setupAllBrowserMocks();

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return <ToastProvider>{children}</ToastProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders>{children}</AllTheProviders>,
    ...options,
  });
};

export { customRender as render };
