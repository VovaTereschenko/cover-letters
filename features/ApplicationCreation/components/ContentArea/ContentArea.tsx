import classNames from "classnames";
import { useRef, useEffect } from "react";
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
  const lastNonEmptyRef = useRef("");
  useEffect(() => {
    if (generatedApplication) {
      lastNonEmptyRef.current = generatedApplication;
    }
  }, [generatedApplication]);

  if (generatedApplication || (isGenerating && lastNonEmptyRef.current)) {
    const textToShow = generatedApplication || lastNonEmptyRef.current;
    return (
      <pre
        className={classNames(
          styles.applicationText,
          "description-large",
          "text-secondary"
        )}
      >
        {textToShow}
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
