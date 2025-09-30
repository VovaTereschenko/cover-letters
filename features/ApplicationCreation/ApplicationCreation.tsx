"use client";

import React from "react";
import { TextField } from "@/components/shared/TextField";
import { Button } from "@/components/shared/Button";
import { CopyIcon, RefreshIcon } from "@/components/icons";
import { LoadingAnimation } from "./components";
import { HitYourGoal } from "@/features/HitYourGoal";
import { useJobApplication } from "@/hooks/useJobApplication";
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
              label="Job title"
              placeholder="Product manager"
              value={state.jobTitle}
              onChange={actions.handleJobTitleChange}
              onBlur={actions.handleJobTitleBlur}
            />
            <TextField
              variant="input"
              label="Company"
              placeholder="Apple"
              value={state.company}
              onChange={actions.handleCompanyChange}
              onBlur={actions.handleCompanyBlur}
            />
          </section>

          <section className={styles.inputSingle}>
            <TextField
              variant="input"
              label="I am good at..."
              placeholder="HTML, CSS and doing things in time"
              value={state.skills}
              onChange={actions.handleSkillsChange}
            />
          </section>

          <section className={styles.textareaSection}>
            <TextField
              variant="textarea"
              label="Additional details"
              placeholder="Describe why you are a great fit or paste your bio"
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
                  Try Again
                </Button>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={actions.handleGenerateNext}
                  className={styles.generateButton}
                  loading={state.isGenerating}
                >
                  {state.isGenerating ? "Generating..." : "Generate Next"}
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
                {state.isGenerating ? "Generating..." : "Generate Now"}
              </Button>
            )}
          </footer>
        </section>

        <section className={styles.rightPanel}>
          <article className={styles.contentArea}>
            {state.generatedApplication ? (
              <pre className={styles.applicationText}>
                {state.generatedApplication}
              </pre>
            ) : state.isGenerating ? (
              <LoadingAnimation />
            ) : (
              <div className={styles.placeholder}>
                Your personalized job application will appear here...
              </div>
            )}
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
                Copy to Clipboard
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
