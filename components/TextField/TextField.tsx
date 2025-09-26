"use client";

import React, { forwardRef, useId } from "react";
import styles from "./TextField.module.css";

interface BaseTextFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  expandable?: boolean;
}

interface InputProps extends BaseTextFieldProps {
  variant: "input";
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
}

interface TextareaProps extends BaseTextFieldProps {
  variant: "textarea";
  rows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  maxSymbols?: number;
}

type TextFieldProps = InputProps | TextareaProps;

const TextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextFieldProps
>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      disabled = false,
      error = false,
      helperText,
      required = false,
      id,
      name,
      className,
      expandable = false,
      variant,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const fieldId = id || generatedId;

    // Check if maxSymbols is exceeded for textarea
    const isMaxSymbolsExceeded =
      variant === "textarea" &&
      (rest as TextareaProps).maxSymbols &&
      value &&
      value.length > (rest as TextareaProps).maxSymbols!;

    // Use error prop or maxSymbols validation
    const hasError = error || isMaxSymbolsExceeded;

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      onChange?.(e.target.value);
    };

    const fieldClasses = [
      styles.field,
      hasError && styles.error,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const containerClasses = [
      expandable ? styles.containerExpandable : styles.container,
      hasError && styles.containerError,
      disabled && styles.containerDisabled,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClasses}>
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>

        {variant === "input" ? (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={fieldId}
            name={name}
            type={(rest as InputProps).type || "text"}
            className={fieldClasses}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            required={required}
          />
        ) : (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={fieldId}
            name={name}
            className={fieldClasses}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            required={required}
            rows={(rest as TextareaProps).rows || 4}
            style={{
              resize: (rest as TextareaProps).resize || "vertical",
            }}
          />
        )}

        {(helperText ||
          (variant === "textarea" && (rest as TextareaProps).maxSymbols)) && (
          <div className={hasError ? styles.errorText : styles.helperText}>
            {helperText}
            {variant === "textarea" && (rest as TextareaProps).maxSymbols && (
              <span className={styles.charCount}>
                {helperText && " "}
                {value?.length || 0}/{(rest as TextareaProps).maxSymbols}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export { TextField };
export type { TextFieldProps, InputProps, TextareaProps };
