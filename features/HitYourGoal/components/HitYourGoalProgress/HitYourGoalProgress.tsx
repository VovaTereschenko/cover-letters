"use client";

import React from "react";
import classNames from "classnames";
import styles from "./HitYourGoalProgress.module.css";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS } from "@/constants";

type HitYourGoalProgressProps = {
  currentStep: number;
  totalSteps?: number;
};

const HitYourGoalProgress: React.FC<HitYourGoalProgressProps> = ({
  currentStep,
  totalSteps = RECOMMENDED_AMOUNT_OF_APPLICATIONS,
}) => {
  const progress = Math.min(currentStep, totalSteps);
  const explanatoryText = `${currentStep} out of ${totalSteps}`;

  return (
    <div className={styles.container}>
      <ol
        className={styles.dotsContainer}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-label={`Progress: ${progress} out of ${totalSteps} applications completed`}
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <li
            key={index}
            className={classNames(styles.dot, {
              [styles.filled]: index < progress,
              [styles.empty]: index >= progress,
            })}
            aria-hidden="true"
          >
            <span className={styles.hiddenText}>
              {index < progress ? "Completed" : "Not completed"}
            </span>
          </li>
        ))}
      </ol>
      <span
        className={classNames(
          styles.text,
          "description-small",
          "text-secondary"
        )}
        aria-live="polite"
      >
        {explanatoryText}
      </span>
    </div>
  );
};

export { HitYourGoalProgress };
