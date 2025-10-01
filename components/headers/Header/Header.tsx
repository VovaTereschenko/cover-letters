"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Logo } from "../../icons/Logo";
import { ProgressIndication } from "../../shared/ProgressIndication/ProgressIndication";
import { IconButton } from "../../shared/IconButton";
import { HomeIcon } from "../../icons";
import { useApplicationProgress } from "@/hooks/useApplicationProgress";
import styles from "./Header.module.css";

type HeaderProps = {
  initialApplicationCount: number;
};

const Header = ({ initialApplicationCount }: HeaderProps) => {
  const router = useRouter();
  const { applicationCount, highlightColor } = useApplicationProgress(
    initialApplicationCount
  );

  const handleHomeClick = () => {
    window.dispatchEvent(new CustomEvent("navigationStarted"));
    router.push("/applications");
  };

  const handleLogoClick = () => {
    window.dispatchEvent(new CustomEvent("navigationStarted"));
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <button
          onClick={handleLogoClick}
          className={styles.logoButton}
          aria-label="Go to home page"
        >
          <Logo width={179} height={48} className={styles.logo} />
        </button>

        <div className={styles.right}>
          <div className={styles.progressWrapper}>
            <ProgressIndication
              currentStep={applicationCount}
              highlightColor={highlightColor}
            />
          </div>
          <IconButton
            icon={<HomeIcon />}
            aria-label="Home"
            onClick={handleHomeClick}
            className={styles.homeButton}
          />
        </div>
      </div>
    </header>
  );
};

export { Header };
