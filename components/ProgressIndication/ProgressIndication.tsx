import styles from "./ProgressIndication.module.css";
import {
  RECOMMENDED_AMOUNT_OF_APPLICATIONS,
  DEFAULT_SINGULAR_TEXT,
  DEFAULT_PLURAL_TEXT,
} from "@/constants";
import classNames from "classnames";
import { CheckmarkIcon } from "../icons";

type ProgressIndicationProps = {
  currentStep: number;
  totalSteps?: number;
  singularText?: string;
  pluralText?: string;
};

const ProgressIndication = ({
  currentStep,
  totalSteps = RECOMMENDED_AMOUNT_OF_APPLICATIONS,
  singularText = DEFAULT_SINGULAR_TEXT,
  pluralText = DEFAULT_PLURAL_TEXT,
}: ProgressIndicationProps) => {
  const progress = Math.min(currentStep, totalSteps);
  const isCompleted = currentStep >= totalSteps;
  const isExceeded = currentStep > totalSteps;
  const explanatoryText = isExceeded
    ? `${currentStep} ${currentStep === 1 ? singularText : pluralText} `
    : `${currentStep}/${totalSteps} ${
        currentStep === 1 ? singularText : pluralText
      }`;

  return (
    <div className={styles.container}>
      <span className={styles.text}>{explanatoryText}</span>
      {isCompleted ? (
        <div className={styles.completedIndicator} aria-label="Completed">
          <CheckmarkIcon />
        </div>
      ) : (
        <ol
          className={styles.dotsContainer}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-label={`Progress: ${progress} out of ${totalSteps} ${pluralText} completed`}
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
      )}
    </div>
  );
};

export { ProgressIndication };
