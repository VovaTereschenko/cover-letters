"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { CheckmarkLargeIcon } from "@/components/icons";
import { RECOMMENDED_AMOUNT_OF_APPLICATIONS } from "@/constants";
import styles from "./GoalAchievement.module.css";

type GoalAchievementProps = {
  isVisible: boolean;
  onClose: () => void;
};

const GoalAchievement = ({ isVisible, onClose }: GoalAchievementProps) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);

      let isCancelled = false;
      const autoClose = async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        if (!isCancelled) {
          onClose();
        }
      };
      autoClose();

      return () => {
        isCancelled = true;
      };
    } else {
      let isCancelled = false;
      const hideComponent = async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!isCancelled) {
          setShouldRender(false);
        }
      };
      hideComponent();

      return () => {
        isCancelled = true;
      };
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={classNames(styles.overlay, {
        [styles.visible]: isVisible,
        [styles.hidden]: !isVisible,
      })}
    >
      <div
        className={classNames(styles.container, {
          [styles.animate]: isVisible,
        })}
      >
        <div className={styles.iconContainer}>
          <CheckmarkLargeIcon />
        </div>
        <h2 className="title-tertiary">Goal Achieved!</h2>
        <p
          className={classNames(
            styles.message,
            "description-medium",
            "text-secondary"
          )}
        >
          Congratulations! You&apos;ve completed{" "}
          {RECOMMENDED_AMOUNT_OF_APPLICATIONS} applications.
        </p>
      </div>
    </div>
  );
};

export { GoalAchievement };
