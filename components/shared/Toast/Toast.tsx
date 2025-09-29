import React from "react";
import styles from "./Toast.module.css";

type ToastProps = {
  message: string;
  isVisible: boolean;
  show: boolean;
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, isVisible, show }) => {
  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${show ? styles.show : styles.hide}`}>
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export { Toast };
