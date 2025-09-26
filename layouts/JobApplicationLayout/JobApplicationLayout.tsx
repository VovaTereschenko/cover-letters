"use client";

import { useState } from "react";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { CopyIcon } from "@/components/icons/CopyIcon";
import styles from "./JobApplicationLayout.module.css";

export default function JobApplicationLayout() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [generatedApplication, setGeneratedApplication] = useState("");
  const [titleText, setTitleText] = useState("New application");

  const updateTitleFromFields = () => {
    if (!jobTitle.trim() && !company.trim()) {
      setTitleText("New application");
      return;
    }

    const parts = [];
    if (jobTitle.trim()) {
      parts.push(jobTitle.trim());
    }
    if (company.trim()) {
      parts.push(company.trim());
    }

    setTitleText(parts.join(", "));
  };

  const handleJobTitleBlur = () => {
    updateTitleFromFields();
  };

  const handleCompanyBlur = () => {
    updateTitleFromFields();
  };

  const getTitleClassName = () => {
    if (titleText === "New application") {
      return `${styles.title} ${styles.titlePlaceholder}`;
    }
    return styles.title;
  };

  const isGenerateDisabled = () => {
    return (
      !jobTitle.trim() ||
      !company.trim() ||
      !skills.trim() ||
      !additionalDetails.trim()
    );
  };

  const handleGenerate = () => {
    // Simulate application generation
    const application = `Dear Hiring Manager at ${company || "your company"},

I am writing to express my interest in the ${
      jobTitle || "position"
    } role. With my expertise in ${
      skills || "various technologies"
    }, I believe I would be a valuable addition to your team.

${additionalDetails}

Thank you for considering my application.

Best regards,
Your Name`;

    setGeneratedApplication(application);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedApplication);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <h1 className={getTitleClassName()}>{titleText}</h1>

        <div className={styles.inputRow}>
          <TextField
            variant="input"
            label="Job title"
            placeholder="Product manager"
            value={jobTitle}
            onChange={setJobTitle}
            onBlur={handleJobTitleBlur}
          />
          <TextField
            variant="input"
            label="Company"
            placeholder="Apple"
            value={company}
            onChange={setCompany}
            onBlur={handleCompanyBlur}
          />
        </div>

        <div className={styles.inputSingle}>
          <TextField
            variant="input"
            label="I am good at..."
            placeholder="HTML, CSS and doing things in time"
            value={skills}
            onChange={setSkills}
          />
        </div>

        <div className={styles.textareaSection}>
          <TextField
            variant="textarea"
            label="Additional details"
            placeholder="I want to help you build awesome solutions to accomplish your goals and vision"
            value={additionalDetails}
            onChange={setAdditionalDetails}
            maxSymbols={1200}
            rows={8}
            resize="none"
            expandable
          />
        </div>

        <div className={styles.buttonSection}>
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerateDisabled()}
            className={styles.generateButton}
          >
            Generate Now
          </Button>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.rightContent}>
          <div className={styles.contentArea}>
            {generatedApplication ? (
              <pre className={styles.applicationText}>
                {generatedApplication}
              </pre>
            ) : (
              <div className={styles.placeholder}>
                Your personalized job application will appear here...
              </div>
            )}
          </div>
          <div className={styles.copyButtonContainer}>
            <Button
              variant="text"
              onClick={handleCopyToClipboard}
              disabled={!generatedApplication}
              className={styles.copyButton}
              icon={<CopyIcon />}
              iconPosition="right"
            >
              Copy to clipboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
