"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@/components/shared/TextField";
import { Button } from "@/components/shared/Button";
import { CopyIcon, RefreshIcon } from "@/components/icons";
import { ContentArea } from "./components";
import { HitYourGoal } from "@/features/HitYourGoal";
import { useJobApplication } from "@/features/ApplicationCreation/hooks/useJobApplication";
import { UI_MESSAGES } from "@/constants/ai";
import styles from "./ApplicationCreation.module.css";

type ApplicationCreationProps = {
  initialApplicationsCount?: number;
};

export default function ApplicationCreation({
  initialApplicationsCount = 0,
}: ApplicationCreationProps) {
  const { state, form, actions } = useJobApplication(initialApplicationsCount);
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <main className={styles.layoutWrapper}>
      <div className={styles.container}>
        <section className={styles.leftPanel}>
          <header>
            <h1 className={actions.getTitleClassName(styles)}>
              {state.titleText}
            </h1>
          </header>

          <section className={styles.inputRow}>
            <Controller
              name="jobTitle"
              control={control}
              render={({ field }) => (
                <TextField
                  variant="input"
                  label={UI_MESSAGES.labels.jobTitle}
                  placeholder={UI_MESSAGES.placeholders.jobTitle}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  error={!!errors.jobTitle}
                  helperText={errors.jobTitle?.message}
                  name={field.name}
                />
              )}
            />
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <TextField
                  variant="input"
                  label={UI_MESSAGES.labels.company}
                  placeholder={UI_MESSAGES.placeholders.company}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  error={!!errors.company}
                  helperText={errors.company?.message}
                  name={field.name}
                />
              )}
            />
          </section>

          <section className={styles.inputSingle}>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <TextField
                  variant="input"
                  label={UI_MESSAGES.labels.skills}
                  placeholder={UI_MESSAGES.placeholders.skills}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  error={!!errors.skills}
                  helperText={errors.skills?.message}
                  name={field.name}
                />
              )}
            />
          </section>

          <section className={styles.textareaSection}>
            <Controller
              name="additionalDetails"
              control={control}
              render={({ field }) => (
                <TextField
                  variant="textarea"
                  label={UI_MESSAGES.labels.additionalDetails}
                  placeholder={UI_MESSAGES.placeholders.additionalDetails}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  maxSymbols={1200}
                  rows={8}
                  resize="none"
                  expandable
                  error={!!errors.additionalDetails}
                  helperText={errors.additionalDetails?.message}
                  name={field.name}
                />
              )}
            />
          </section>

          <footer className={styles.buttonSection}>
            {state.generatedApplication ? (
              <div className={styles.buttonGroup}>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={actions.handleTryAgain}
                  className={styles.generateButton}
                  icon={<RefreshIcon />}
                >
                  {UI_MESSAGES.generateButton.tryAgain}
                </Button>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={actions.handleGenerateNext}
                  className={styles.generateButton}
                  loading={state.isGenerating}
                >
                  {state.isGenerating
                    ? UI_MESSAGES.generateButton.generating
                    : UI_MESSAGES.generateButton.generateNext}
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="medium"
                onClick={actions.handleGenerate}
                disabled={actions.isGenerateDisabled() || state.isGenerating}
                className={styles.generateButton}
                loading={state.isGenerating}
              >
                {state.isGenerating
                  ? UI_MESSAGES.generateButton.generating
                  : UI_MESSAGES.generateButton.generateNow}
              </Button>
            )}
          </footer>
        </section>

        <section className={styles.rightPanel}>
          <article className={styles.contentArea}>
            <ContentArea
              generatedApplication={state.generatedApplication}
              isGenerating={state.isGenerating}
            />
          </article>
          {state.generatedApplication && (
            <footer className={styles.copyButtonContainer}>
              <Button
                variant="text"
                onClick={actions.handleCopyToClipboard}
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

      {state.generatedApplication && (
        <aside>
          <HitYourGoal
            onCreateNew={actions.handleCreateNew}
            applicationsCount={state.applicationsCount}
          />
        </aside>
      )}
    </main>
  );
}
