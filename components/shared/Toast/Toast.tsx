import React from "react";
import classNames from "classnames";
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
    <div
      className={classNames(styles.toast, {
        [styles.show]: show,
        [styles.hide]: !show,
      })}
    >
      <span className={classNames(styles.message)}>{message}</span>
    </div>
  );
};

export { Toast };
