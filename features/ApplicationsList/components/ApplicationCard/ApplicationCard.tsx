import { Button } from "@/components/shared/Button";
import { CopyIcon, DeleteIcon } from "@/components/icons";
import classNames from "classnames";
import styles from "./ApplicationCard.module.css";

type ApplicationCardProps = {
  content: string;
  onCardClick: () => void;
  onDelete: () => void;
  onCopy: () => void;
  isPlaceholder?: boolean;
};

export function ApplicationCard({
  content,
  onCardClick,
  onDelete,
  onCopy,
  isPlaceholder = false,
}: ApplicationCardProps) {
  if (isPlaceholder) {
    return (
      <article
        className={classNames(styles.applicationCard, styles.placeholder)}
      >
        <section className={styles.cardContent}>
          <div className={styles.cardText}>
            <div className={styles.skeletonLines}>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLineShort}></div>
            </div>
          </div>
        </section>
        <footer
          className={styles.cardActions}
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="text" icon={<DeleteIcon />} onClick={() => {}}>
            Delete
          </Button>
          <Button
            variant="text"
            icon={<CopyIcon />}
            onClick={() => {}}
            iconPosition="right"
          >
            Copy to clipboard
          </Button>
        </footer>
      </article>
    );
  }

  return (
    <article
      className={styles.applicationCard}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <section className={styles.cardContent}>
        <p
          className={classNames(
            styles.cardText,
            "description-large",
            "text-secondary"
          )}
        >
          {content}
        </p>
      </section>
      <footer className={styles.cardActions}>
        <Button
          variant="text"
          icon={<DeleteIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </Button>
        <Button
          variant="text"
          icon={<CopyIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          iconPosition="right"
        >
          Copy to clipboard
        </Button>
      </footer>
    </article>
  );
}
