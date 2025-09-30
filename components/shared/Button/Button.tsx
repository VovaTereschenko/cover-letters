"use client";

import React from "react";
import styles from "./Button.module.css";
import classNames from "classnames";
import { Spinner } from "../../icons/Spinner";

type ButtonVariant = "primary" | "outlined" | "text";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  onClick,
  className,
  type = "button",
  icon,
  iconPosition = "left",
}: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={classNames(
      styles.button,
      styles[variant],
      styles[size],
      {
        [styles.loading]: loading,
        [styles.disabled]: disabled,
      },
      className
    )}
  >
    {loading && <Spinner className={styles.spinner} />}
    <span
      className={classNames(styles.content, {
        [styles.loadingContent]: loading,
      })}
    >
      {icon && iconPosition === "left" && (
        <span className={styles.icon}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className={styles.icon}>{icon}</span>
      )}
    </span>
  </button>
);

export { Button };
