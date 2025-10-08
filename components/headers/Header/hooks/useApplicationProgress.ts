"use client";

import { useApplicationsCount, useHighlightColor } from "@/store/applications";

export function useApplicationProgress() {
  const applicationCount = useApplicationsCount();
  const highlightColor = useHighlightColor();

  return {
    applicationCount,
    highlightColor,
  };
}
