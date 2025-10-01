"use client";

import { useEffect, useState } from "react";
import { localStorageService } from "@/lib/localStorage";
import { setClientApplicationCount } from "@/lib/clientCookies";
import { HighlightColor } from "@/types";

export function useApplicationProgress(initialApplicationCount: number) {
  const [applicationCount, setApplicationCount] = useState(
    initialApplicationCount
  );
  const [highlightColor, setHighlightColor] = useState<HighlightColor>(null);

  useEffect(() => {
    const updateApplicationCount = () => {
      const applications = localStorageService.getApplications();
      const newCount = applications.length;
      setApplicationCount(newCount);
      setClientApplicationCount(newCount);
    };

    const handleApplicationsUpdate = () => {
      updateApplicationCount();
    };

    const handleProgressHighlight = (event: CustomEvent) => {
      setHighlightColor(event.detail.color);
      setTimeout(() => {
        setHighlightColor(null);
      }, 2000);
    };

    updateApplicationCount();

    window.addEventListener("applicationsUpdated", handleApplicationsUpdate);
    window.addEventListener(
      "progressHighlight",
      handleProgressHighlight as EventListener
    );

    return () => {
      window.removeEventListener(
        "applicationsUpdated",
        handleApplicationsUpdate
      );
      window.removeEventListener(
        "progressHighlight",
        handleProgressHighlight as EventListener
      );
    };
  }, []);

  return {
    applicationCount,
    highlightColor,
  };
}
