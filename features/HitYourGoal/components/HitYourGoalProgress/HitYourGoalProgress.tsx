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
      <div className={styles.dotsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={classNames(styles.dot, {
              [styles.filled]: index < progress,
              [styles.empty]: index >= progress,
            })}
          />
        ))}
      </div>
      <span className={styles.text}>{explanatoryText}</span>
    </div>
  );
};

export { HitYourGoalProgress };
