import { useEffect, useCallback, useRef } from "react";
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

  const memoizedOnGoalAchieved = useCallback(onGoalAchieved, [onGoalAchieved]);
  const memoizedOnCountUpdate = useCallback(onCountUpdate, [onCountUpdate]);

  useEffect(() => {
    if (lastProcessedCount.current !== currentCount) {
      if (
        currentCount === RECOMMENDED_AMOUNT_OF_APPLICATIONS &&
        previousCount < RECOMMENDED_AMOUNT_OF_APPLICATIONS
      ) {
        memoizedOnGoalAchieved();
      }
      memoizedOnCountUpdate(currentCount);
      lastProcessedCount.current = currentCount;
    }
  }, [
    currentCount,
    previousCount,
    memoizedOnGoalAchieved,
    memoizedOnCountUpdate,
  ]);
}
