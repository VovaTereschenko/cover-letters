import { handleGoalAchievement } from "../goalAchievement";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS, STORAGE_KEYS } from "@/constants";
import {
  mockSessionStorage,
  setupSessionStorageMock,
} from "../../../../test-utils/mockStorage";

setupSessionStorageMock();

describe("handleGoalAchievement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  it("sets goal achievement flag when reaching recommended amount from below", () => {
    const currentCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS;
    const previousCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS - 1;

    handleGoalAchievement(currentCount, previousCount);

    expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.GOAL_ACHIEVEMENT,
      "true"
    );
  });

  it("does not set goal achievement flag when already at recommended amount", () => {
    const currentCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS;
    const previousCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS;

    handleGoalAchievement(currentCount, previousCount);

    expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
  });

  it("does not set goal achievement flag when exceeding recommended amount but was already above", () => {
    const currentCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS + 1;
    const previousCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS;

    handleGoalAchievement(currentCount, previousCount);

    expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
  });

  it("does not set goal achievement flag when below recommended amount", () => {
    const currentCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS - 1;
    const previousCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS - 2;

    handleGoalAchievement(currentCount, previousCount);

    expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
  });

  it("does not set goal achievement flag when count decreases from recommended amount", () => {
    const currentCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS - 1;
    const previousCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS;

    handleGoalAchievement(currentCount, previousCount);

    expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
  });

  it("sets goal achievement flag when reaching exactly recommended amount for the first time", () => {
    const currentCount = RECOMMENDED_AMOUNT_OF_APPLICATIONS;
    const previousCount = 0;

    handleGoalAchievement(currentCount, previousCount);

    expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.GOAL_ACHIEVEMENT,
      "true"
    );
  });
});
