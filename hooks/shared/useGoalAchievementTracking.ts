import { useEffect, useCallback, useRef } from "react";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS } from "@/constants";

export function useGoalAchievementTracking<TAction>({
  currentCount,
  previousCount,
  dispatch,
  showGoalAchievementAction,
  setPreviousCountAction,
}: {
  currentCount: number;
  previousCount: number;
  dispatch: React.Dispatch<TAction>;
  showGoalAchievementAction: () => TAction;
  setPreviousCountAction: (count: number) => TAction;
}) {
  const lastProcessedCount = useRef<number>(previousCount);

  const memoizedShowGoalAction = useCallback(
    () => showGoalAchievementAction(),
    [showGoalAchievementAction]
  );
  const memoizedSetPreviousAction = useCallback(
    (count: number) => setPreviousCountAction(count),
    [setPreviousCountAction]
  );

  useEffect(() => {
    if (lastProcessedCount.current !== currentCount) {
      if (
        currentCount === RECOMMENDED_AMOUNT_OF_APPLICATIONS &&
        previousCount < RECOMMENDED_AMOUNT_OF_APPLICATIONS
      ) {
        dispatch(memoizedShowGoalAction());
      }
      dispatch(memoizedSetPreviousAction(currentCount));
      lastProcessedCount.current = currentCount;
    }
  }, [
    currentCount,
    previousCount,
    dispatch,
    memoizedShowGoalAction,
    memoizedSetPreviousAction,
  ]);
}
