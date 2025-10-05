import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ApplicationsCountProvider } from "@/contexts/ApplicationsCountContext";
import { ToastProvider } from "@/contexts/ToastContext";

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn(),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(""),
  },
  writable: true,
  configurable: true,
});

global.fetch = jest.fn();

const originalDispatchEvent = window.dispatchEvent;
window.dispatchEvent = jest.fn(originalDispatchEvent);

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

export * from "@testing-library/react";
export { customRender as render };
