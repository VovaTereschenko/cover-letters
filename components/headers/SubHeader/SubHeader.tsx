import React from "react";
import { Button } from "@/components/shared/Button";
import { PlusIcon } from "@/components/icons";
import styles from "./SubHeader.module.css";

type SubHeaderProps = {
  onCreateNew?: () => void;
};

export const SubHeader: React.FC<SubHeaderProps> = ({ onCreateNew }) => {
  return (
    <section className={styles.subHeader}>
      <header>
        <h1 className="title-hero">Applications</h1>
      </header>
      <nav>
        <Button
          variant="primary"
          size="small"
          icon={<PlusIcon />}
          onClick={onCreateNew}
        >
          Create New
        </Button>
      </nav>
    </section>
  );
};
