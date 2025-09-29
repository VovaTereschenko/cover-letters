"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { localStorageService } from "@/lib/localStorage";

type ApplicationsCountContextType = {
  applicationsCount: number;
  setApplicationsCount: (count: number) => void;
};

const ApplicationsCountContext = createContext<
  ApplicationsCountContextType | undefined
>(undefined);

export const useApplicationsCount = () => {
  const context = useContext(ApplicationsCountContext);
  if (!context) {
    throw new Error(
      "useApplicationsCount must be used within ApplicationsCountProvider"
    );
  }
  return context;
};

type ApplicationsCountProviderProps = {
  children: ReactNode;
  initialCount: number;
};

export const ApplicationsCountProvider = ({
  children,
  initialCount,
}: ApplicationsCountProviderProps) => {
  const [applicationsCount, setApplicationsCount] = useState(initialCount);

  useEffect(() => {
    const updateFromLocalStorage = () => {
      const applications = localStorageService.getApplications();
      setApplicationsCount(applications.length);
    };

    updateFromLocalStorage();

    const handleApplicationsUpdate = () => {
      updateFromLocalStorage();
    };

    window.addEventListener("applicationsUpdated", handleApplicationsUpdate);

    return () => {
      window.removeEventListener(
        "applicationsUpdated",
        handleApplicationsUpdate
      );
    };
  }, []);

  return (
    <ApplicationsCountContext.Provider
      value={{ applicationsCount, setApplicationsCount }}
    >
      {children}
    </ApplicationsCountContext.Provider>
  );
};
