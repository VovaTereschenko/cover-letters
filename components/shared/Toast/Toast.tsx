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
      <span
        className={classNames("description-small")}
        style={{ fontWeight: "var(--font-weight-medium)", color: "white" }}
      >
        {message}
      </span>
    </div>
  );
};

export { Toast };
