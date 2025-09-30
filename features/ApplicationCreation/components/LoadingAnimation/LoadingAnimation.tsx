import React from "react";
import styles from "./LoadingAnimation.module.css";

export const LoadingAnimation = () => {
  return (
    <div className={styles.container}>
      <div className={styles.animated} />
    </div>
  );
};
