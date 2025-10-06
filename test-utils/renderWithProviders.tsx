import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ApplicationsCountProvider } from "@/contexts/ApplicationsCountContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { setupAllBrowserMocks } from "./mockStorage";
export * from "@testing-library/react";

setupAllBrowserMocks();

interface AllTheProvidersProps {
  children: React.ReactNode;
  initialApplicationsCount?: number;
}

const AllTheProviders = ({
  children,
  initialApplicationsCount = 0,
}: AllTheProvidersProps) => {
  return (
    <ApplicationsCountProvider initialCount={initialApplicationsCount}>
      <ToastProvider>{children}</ToastProvider>
    </ApplicationsCountProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    initialApplicationsCount?: number;
  }
) => {
  const { initialApplicationsCount, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders initialApplicationsCount={initialApplicationsCount}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

export { customRender as render };
