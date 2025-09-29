"use client";

import React from "react";
import styles from "./IconButton.module.css";
import classNames from "classnames";

type IconButtonSize = "small" | "medium" | "large";

type IconButtonProps = {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: IconButtonSize;
  className?: string;
  "aria-label": string;
};

const IconButton = ({
  icon,
  onClick,
  disabled = false,
  size = "medium",
  className,
  "aria-label": ariaLabel,
}: IconButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={classNames(styles.iconButton, styles[size], className)}
    aria-label={ariaLabel}
    type="button"
  >
    {icon}
  </button>
);

export { IconButton };
