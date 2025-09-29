import React from "react";
import { Button } from "@/components/shared/Button";
import { PlusIcon } from "@/components/icons";
import styles from "./SubHeader.module.css";

type SubHeaderProps = {
  onCreateNew?: () => void;
};

const SubHeader: React.FC<SubHeaderProps> = ({ onCreateNew }) => {
  return (
    <section className={styles.subHeader}>
      <header>
        <h1 className={styles.title}>Applications</h1>
      </header>
      <nav>
        <Button
          variant="primary"
          size="medium"
          icon={<PlusIcon />}
          onClick={onCreateNew}
        >
          Create New
        </Button>
      </nav>
    </section>
  );
};

export { SubHeader };
