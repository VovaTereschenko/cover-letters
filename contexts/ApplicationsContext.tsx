"use client";

import { createContext, useContext, ReactNode, useState } from "react";

type ApplicationsContextType = {
  applicationsCount: number;
  setApplicationsCount: (count: number) => void;
};

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(
  undefined
);

export const useApplicationsContext = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error(
      "useApplicationsContext must be used within ApplicationsProvider"
    );
  }
  return context;
};

type ApplicationsProviderProps = {
  children: ReactNode;
};

export const ApplicationsProvider = ({
  children,
}: ApplicationsProviderProps) => {
  const [applicationsCount, setApplicationsCount] = useState(0);

  return (
    <ApplicationsContext.Provider
      value={{ applicationsCount, setApplicationsCount }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
};
