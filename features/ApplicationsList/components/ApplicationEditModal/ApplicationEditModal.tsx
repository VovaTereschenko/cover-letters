"use client";

import React from "react";
import { Modal } from "../../../../components/shared/Modal/Modal";
import { Button } from "../../../../components/shared/Button";
import { TextField } from "../../../../components/shared/TextField";
import { CopyIcon } from "../../../../components/icons";
import styles from "./ApplicationEditModal.module.css";

type ApplicationEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onCopy: () => void;
  onSaveAndClose?: () => void;
};

const ApplicationEditModal = ({
  isOpen,
  onClose,
  title,
  content,
  onContentChange,
  onSave,
  onCopy,
  onSaveAndClose,
}: ApplicationEditModalProps) => {
  const handleSave = () => {
    if (onSaveAndClose) {
      onSaveAndClose();
    } else {
      onSave();
    }
  };

  const footer = (
    <div className={styles.actions}>
      <Button variant="outlined" onClick={onClose}>
        Cancel
      </Button>
      <div className={styles.rightActions}>
        <Button
          variant="text"
          icon={<CopyIcon />}
          onClick={onCopy}
          iconPosition="right"
        >
          Copy to clipboard
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="large"
      footer={footer}
    >
      <TextField
        variant="textarea"
        label="Application Content"
        value={content}
        onChange={onContentChange}
        placeholder="Edit your application..."
        rows={12}
        expandable
      />
    </Modal>
  );
};

export { ApplicationEditModal };
