import { useEffect, useState, useRef } from "react";
import styles from "./ProgressIndication.module.css";
import {
  RECOMMENDED_AMOUNT_OF_APPLICATIONS,
  DEFAULT_SINGULAR_TEXT,
  DEFAULT_PLURAL_TEXT,
} from "@/constants";
import classNames from "classnames";
import { CheckmarkIcon } from "../../icons";

type ProgressIndicationProps = {
  currentStep: number;
  totalSteps?: number;
  singularText?: string;
  pluralText?: string;
  highlightColor?: "positive" | "negative" | null;
};

const ProgressIndication = ({
  currentStep,
  totalSteps = RECOMMENDED_AMOUNT_OF_APPLICATIONS,
  singularText = DEFAULT_SINGULAR_TEXT,
  pluralText = DEFAULT_PLURAL_TEXT,
  highlightColor = null,
}: ProgressIndicationProps) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const previousStepRef = useRef(currentStep);

  useEffect(() => {
    const previousStep = previousStepRef.current;

    if (currentStep > previousStep && currentStep < 6) {
      setIsHighlighted(true);

      setTimeout(() => {
        setIsHighlighted(false);
      }, 2000);
    }

    previousStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    if (highlightColor) {
      setIsHighlighted(true);
      setTimeout(() => {
        setIsHighlighted(false);
      }, 2000);
    }
  }, [highlightColor]);

  const progress = Math.min(currentStep, totalSteps);
  const isCompleted = currentStep >= totalSteps;
  const isExceeded = currentStep > totalSteps;

  const countText = isExceeded
    ? `${currentStep}`
    : `${currentStep}/${totalSteps}`;

  const itemText = currentStep === 1 ? singularText : pluralText;
  const itemType = itemText.split(" generated")[0];

  return (
    <div
      className={classNames(styles.container, {
        [styles.highlighted]:
          isHighlighted && (!highlightColor || highlightColor === "positive"),
        [styles.highlightedRed]: isHighlighted && highlightColor === "negative",
      })}
    >
      <span className={styles.text}>
        {countText} {itemType}
        <span className={styles.generatedText}> generated</span>
      </span>
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
