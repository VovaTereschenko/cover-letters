import classNames from "classnames";
import { LoadingAnimation } from "../LoadingAnimation";
import { UI_MESSAGES } from "@/constants/ai";
import styles from "./ContentArea.module.css";

type ContentAreaProps = {
  generatedApplication: string;
  isGenerating: boolean;
};

export function ContentArea({
  generatedApplication,
  isGenerating,
}: ContentAreaProps) {
  if (generatedApplication) {
    return (
      <pre
        className={classNames(
          styles.applicationText,
          "description-large",
          "text-secondary"
        )}
      >
        {generatedApplication}
      </pre>
    );
  }

  if (isGenerating) {
    return <LoadingAnimation />;
  }

  return (
    <div
      className={classNames(
        styles.placeholder,
        "description-large",
        "text-secondary"
      )}
    >
      {UI_MESSAGES.placeholders.applicationPreview}
    </div>
  );
}
