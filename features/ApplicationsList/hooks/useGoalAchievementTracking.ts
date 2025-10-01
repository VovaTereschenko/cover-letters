import { useEffect } from "react";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS } from "@/constants";
import type { ApplicationsAction } from "../types";

export function useGoalAchievementTracking({
  applicationsLength,
  previousCount,
  dispatch,
}: {
  applicationsLength: number;
  previousCount: number;
  dispatch: React.Dispatch<ApplicationsAction>;
}) {
  useEffect(() => {
    if (
      applicationsLength === RECOMMENDED_AMOUNT_OF_APPLICATIONS &&
      previousCount < RECOMMENDED_AMOUNT_OF_APPLICATIONS
    ) {
      dispatch({ type: "SHOW_GOAL_ACHIEVEMENT" });
    }
    dispatch({
      type: "SET_PREVIOUS_COUNT",
      payload: applicationsLength,
    });
  }, [applicationsLength, previousCount, dispatch]);
}
