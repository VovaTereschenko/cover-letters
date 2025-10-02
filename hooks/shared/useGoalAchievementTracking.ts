import { useEffect, useRef } from "react";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS } from "@/constants";

export function useGoalAchievementTracking({
  currentCount,
  previousCount,
  onGoalAchieved,
  onCountUpdate,
}: {
  currentCount: number;
  previousCount: number;
  onGoalAchieved: () => void;
  onCountUpdate: (count: number) => void;
}) {
  const lastProcessedCount = useRef<number>(previousCount);

  useEffect(() => {
    if (lastProcessedCount.current !== currentCount) {
      if (
        currentCount === RECOMMENDED_AMOUNT_OF_APPLICATIONS &&
        previousCount < RECOMMENDED_AMOUNT_OF_APPLICATIONS
      ) {
        onGoalAchieved();
      }
      onCountUpdate(currentCount);
      lastProcessedCount.current = currentCount;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCount, previousCount]);
}
