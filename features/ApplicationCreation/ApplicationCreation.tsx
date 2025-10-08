"use client";

import React from "react";
import { Button } from "@/components/shared/Button";
import { CopyIcon, RefreshIcon } from "@/components/icons";
import { ContentArea, ControlledTextField } from "./components";
import { HitYourGoal } from "@/features/HitYourGoal";
import { useJobApplicationForm } from "./hooks/useJobApplicationForm";
import {
  useTitleTextSync,
  useApplicationGeneration,
  useApplicationActions,
  useClipboard,
} from "./hooks";
import {
  useGeneratedApplication,
  useTitleText,
  useIsGenerating,
} from "@/store/jobApplication";
import { useApplicationsCount } from "@/store/applications";
import { UI_MESSAGES } from "@/constants/ai";
import styles from "./ApplicationCreation.module.css";

export default function ApplicationCreation() {
  const generatedApplication = useGeneratedApplication();
  const titleText = useTitleText();
  const isGenerating = useIsGenerating();
  const applicationsCount = useApplicationsCount();

  const form = useJobApplicationForm();
  const {
    control,
    formState: { errors },
    watch,
    reset,
    trigger,
  } = form;
  const formValues = watch();

  useTitleTextSync(formValues);
  const { handleGenerate } = useApplicationGeneration(trigger);
  const { handleTryAgain, handleGenerateNext, handleCreateNew } =
    useApplicationActions();
  const { handleCopyToClipboard } = useClipboard();

  const onGenerate = () => handleGenerate(formValues);
  const onCopyToClipboard = () => handleCopyToClipboard(generatedApplication);
  const onCreateNew = () => handleCreateNew(reset);

  const getTitleClassName = (styles: Record<string, string>) => {
    const baseClass = styles.title;
    if (isGenerating) return `${baseClass} ${styles.generating}`;
    if (generatedApplication) return `${baseClass} ${styles.completed}`;
    return baseClass;
  };

  const isGenerateDisabled = () => {
    const isFormValid =
      formValues.jobTitle?.trim() && formValues.company?.trim();
    return isGenerating || !isFormValid;
  };

  return (
    <main className={styles.layoutWrapper}>
      <div className={styles.container}>
        <section className={styles.leftPanel}>
          <header>
            <h1 className={getTitleClassName(styles)}>{titleText}</h1>
          </header>

          <section className={styles.inputRow}>
            <ControlledTextField
              name="jobTitle"
              control={control}
              errors={errors}
              label={UI_MESSAGES.labels.jobTitle}
              placeholder={UI_MESSAGES.placeholders.jobTitle}
            />
            <ControlledTextField
              name="company"
              control={control}
              errors={errors}
              label={UI_MESSAGES.labels.company}
              placeholder={UI_MESSAGES.placeholders.company}
            />
          </section>

          <section className={styles.inputSingle}>
            <ControlledTextField
              name="skills"
              control={control}
              errors={errors}
              label={UI_MESSAGES.labels.skills}
              placeholder={UI_MESSAGES.placeholders.skills}
            />
          </section>

          <section className={styles.textareaSection}>
            <ControlledTextField
              name="additionalDetails"
              control={control}
              errors={errors}
              label={UI_MESSAGES.labels.additionalDetails}
              placeholder={UI_MESSAGES.placeholders.additionalDetails}
              variant="textarea"
              maxSymbols={1200}
              rows={8}
              resize="none"
              expandable
            />
          </section>

          <footer className={styles.buttonSection}>
            {generatedApplication ? (
              <div className={styles.buttonGroup}>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={handleTryAgain}
                  className={styles.generateButton}
                  icon={<RefreshIcon />}
                >
                  {UI_MESSAGES.generateButton.tryAgain}
                </Button>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={handleGenerateNext}
                  className={styles.generateButton}
                  loading={isGenerating}
                >
                  {isGenerating
                    ? UI_MESSAGES.generateButton.generating
                    : UI_MESSAGES.generateButton.generateNext}
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="medium"
                onClick={onGenerate}
                disabled={isGenerateDisabled() || isGenerating}
                className={styles.generateButton}
                loading={isGenerating}
              >
                {isGenerating
                  ? UI_MESSAGES.generateButton.generating
                  : UI_MESSAGES.generateButton.generateNow}
              </Button>
            )}
          </footer>
        </section>

        <section className={styles.rightPanel}>
          <article className={styles.contentArea}>
            <ContentArea
              generatedApplication={generatedApplication}
              isGenerating={isGenerating}
            />
          </article>
          {generatedApplication && (
            <footer className={styles.copyButtonContainer}>
              <Button
                variant="text"
                onClick={onCopyToClipboard}
                className={styles.copyButton}
                icon={<CopyIcon />}
                iconPosition="right"
              >
                {UI_MESSAGES.labels.copyToClipboard}
              </Button>
            </footer>
          )}
        </section>
      </div>

      {generatedApplication && (
        <aside>
          <HitYourGoal
            onCreateNew={onCreateNew}
            applicationsCount={applicationsCount}
          />
        </aside>
      )}
    </main>
  );
}
