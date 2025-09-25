"use client";

import React from "react";
import { Logo } from "../icons/Logo";
import { ProgressIndication } from "../ProgressIndication/ProgressIndication";
import { IconButton } from "../IconButton";
import { HomeIcon } from "../icons";
import styles from "./Header.module.css";

type HeaderProps = {
  currentStep?: number;
  onHomeClick?: () => void;
  className?: string;
};

const Header = ({ currentStep = 3, onHomeClick, className }: HeaderProps) => (
  <header className={`${styles.header} ${className || ""}`}>
    <div className={styles.container}>
      <Logo width={179} height={48} className={styles.logo} />

      <div className={styles.right}>
        <div className={styles.progressWrapper}>
          <ProgressIndication currentStep={currentStep} />
        </div>
        <IconButton
          icon={<HomeIcon />}
          aria-label="Home"
          size="large"
          onClick={onHomeClick}
          className={styles.homeButton}
        />
      </div>
    </div>
  </header>
);

export { Header };
