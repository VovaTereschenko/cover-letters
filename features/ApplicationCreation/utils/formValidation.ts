import {
  validateField,
  validateJobApplicationForm,
  type JobApplicationFormData,
} from "@/lib/validations";
import type { JobApplicationAction } from "../types";

export const handleFieldValidation = (
  fieldName: keyof JobApplicationFormData,
  value: string,
  validationErrors: Partial<Record<keyof JobApplicationFormData, string>>,
  dispatch: React.Dispatch<JobApplicationAction>
) => {
  const validation = validateField(fieldName, value);
  if (!validation.success && validation.error) {
    dispatch({
      type: "SET_VALIDATION_ERRORS",
      payload: { ...validationErrors, [fieldName]: validation.error },
    });
  } else {
    dispatch({ type: "CLEAR_VALIDATION_ERROR", payload: fieldName });
  }
};

export const isFormValid = (formData: {
  jobTitle: string;
  company: string;
  skills: string;
  additionalDetails: string;
}) => {
  const validation = validateJobApplicationForm(formData);
  return validation.success;
};

export const getFieldError = (
  fieldName: keyof JobApplicationFormData,
  validationErrors: Partial<Record<keyof JobApplicationFormData, string>>
) => {
  return validationErrors[fieldName];
};

export const hasFieldError = (
  fieldName: keyof JobApplicationFormData,
  validationErrors: Partial<Record<keyof JobApplicationFormData, string>>
) => {
  return Boolean(validationErrors[fieldName]);
};
