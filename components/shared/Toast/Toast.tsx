import React, { useEffect, useState } from "react";
import styles from "./Toast.module.css";

type ToastProps = {
  message: string;
  isVisible: boolean;
  duration?: number;
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  duration = 2000,
  onClose,
}) => {
  const [show, setShow] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setShow(true);
      });

      const timer = setTimeout(() => {
        setShow(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  useEffect(() => {
    if (!show && shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
        onClose();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [show, shouldRender, onClose]);

  useEffect(() => {
    if (!isVisible) {
      setShow(false);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.toast} ${show ? styles.show : styles.hide}`}>
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export { Toast };
