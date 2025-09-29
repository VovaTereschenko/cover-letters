"use client";

import React from "react";
import { Modal } from "../Modal";
import { Button } from "../Button";
import styles from "./ConfirmDialog.module.css";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const footer = (
    <div className={styles.actions}>
      <Button variant="outlined" onClick={onCancel}>
        {cancelText}
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="small"
      showCloseButton={false}
      footer={footer}
    >
      <p className={styles.message}>{message}</p>
    </Modal>
  );
};

export { ConfirmDialog };
