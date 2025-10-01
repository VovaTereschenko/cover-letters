import { useEffect } from "react";
import { localStorageService } from "@/lib/localStorage";

export function useApplicationsCountSync<TAction>({
  initialCount,
  dispatch,
  setCountAction,
}: {
  initialCount: number;
  dispatch: React.Dispatch<TAction>;
  setCountAction: (count: number) => TAction;
}) {
  useEffect(() => {
    const applications = localStorageService.getApplications();
    const actualCount = applications.length;

    if (actualCount === initialCount) return;

    dispatch(setCountAction(actualCount));
  }, [initialCount, dispatch, setCountAction]);
}
