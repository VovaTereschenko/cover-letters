import {
  validateField,
  validateJobApplicationForm,
  type JobApplicationFormData,
} from "@/lib/validations";

export const handleFieldValidation = (
  fieldName: keyof JobApplicationFormData,
  value: string,
  validationErrors: Partial<Record<keyof JobApplicationFormData, string>>,
  onValidationError: (
    errors: Partial<Record<keyof JobApplicationFormData, string>>
  ) => void,
  onClearError: (fieldName: keyof JobApplicationFormData) => void
) => {
  const validation = validateField(fieldName, value);
  if (!validation.success && validation.error) {
    onValidationError({
      ...validationErrors,
      [fieldName]: validation.error,
    });
  } else {
    onClearError(fieldName);
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
