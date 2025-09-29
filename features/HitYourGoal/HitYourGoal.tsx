import React from "react";
import { HitYourGoalProgress } from "./components";
import { Button } from "@/components/shared/Button";
import { PlusIcon } from "@/components/icons";
import styles from "./HitYourGoal.module.css";

type HitYourGoalProps = {
  onCreateNew?: () => void;
  applicationsCount?: number;
};

export const HitYourGoal: React.FC<HitYourGoalProps> = ({
  onCreateNew,
  applicationsCount = 0,
}) => {
  if (applicationsCount >= 5) {
    return null;
  }

  return (
    <section className={styles.container}>
      <article className={styles.content}>
        <header>
          <h2 className={styles.title}>Hit your goal</h2>
          <p className={styles.description}>
            Generate and send out couple more job applications <br /> today to
            get hired faster
          </p>
        </header>
        <footer className={styles.actions}>
          <Button
            variant="primary"
            size="large"
            onClick={onCreateNew}
            icon={<PlusIcon />}
          >
            Create New
          </Button>
          <div className={styles.progress}>
            <HitYourGoalProgress currentStep={applicationsCount} />
          </div>
        </footer>
      </article>
    </section>
  );
};
