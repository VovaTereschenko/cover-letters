"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { CheckmarkLargeIcon } from "@/components/icons";
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

      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      return () => clearTimeout(timer);
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
          Congratulations! You&apos;ve completed 5 applications.
        </p>
      </div>
    </div>
  );
};

export { GoalAchievement };
