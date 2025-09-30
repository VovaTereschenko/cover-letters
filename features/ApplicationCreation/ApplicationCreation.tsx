"use client";

import React from "react";
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
  const { state, actions } = useJobApplication(initialApplicationsCount);

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
            <TextField
              variant="input"
              label={UI_MESSAGES.labels.jobTitle}
              placeholder={UI_MESSAGES.placeholders.jobTitle}
              value={state.jobTitle}
              onChange={actions.handleJobTitleChange}
              onBlur={actions.handleJobTitleBlur}
            />
            <TextField
              variant="input"
              label={UI_MESSAGES.labels.company}
              placeholder={UI_MESSAGES.placeholders.company}
              value={state.company}
              onChange={actions.handleCompanyChange}
              onBlur={actions.handleCompanyBlur}
            />
          </section>

          <section className={styles.inputSingle}>
            <TextField
              variant="input"
              label={UI_MESSAGES.labels.skills}
              placeholder={UI_MESSAGES.placeholders.skills}
              value={state.skills}
              onChange={actions.handleSkillsChange}
            />
          </section>

          <section className={styles.textareaSection}>
            <TextField
              variant="textarea"
              label={UI_MESSAGES.labels.additionalDetails}
              placeholder={UI_MESSAGES.placeholders.additionalDetails}
              value={state.additionalDetails}
              onChange={actions.handleAdditionalDetailsChange}
              maxSymbols={1200}
              rows={8}
              resize="none"
              expandable
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
