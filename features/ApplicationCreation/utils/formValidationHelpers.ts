import type { JobApplicationFormData } from "@/lib/validations";
import type { JobApplicationState, JobApplicationAction } from "../types";
import {
  handleFieldValidation,
  isFormValid,
  getFieldError,
  hasFieldError,
} from "../utils/formValidation";

export function createFormValidation({
  state,
  dispatch,
}: {
  state: JobApplicationState;
  dispatch: React.Dispatch<JobApplicationAction>;
}) {
  const validateField = (
    fieldName: keyof JobApplicationFormData,
    value: string
  ) => {
    handleFieldValidation(
      fieldName,
      value,
      state.validationErrors,
      (errors) => {
        dispatch({ type: "SET_VALIDATION_ERRORS", payload: errors });
      },
      (fieldName) => {
        dispatch({ type: "CLEAR_VALIDATION_ERROR", payload: fieldName });
      }
    );
  };

  const checkFormValidity = () => {
    const formData = {
      jobTitle: state.jobTitle,
      company: state.company,
      skills: state.skills,
      additionalDetails: state.additionalDetails,
    };

    return isFormValid(formData);
  };

  const getErrorForField = (fieldName: keyof JobApplicationFormData) =>
    getFieldError(fieldName, state.validationErrors);

  const checkFieldHasError = (fieldName: keyof JobApplicationFormData) =>
    hasFieldError(fieldName, state.validationErrors);

  return {
    handleFieldValidation: validateField,
    isFormValid: checkFormValidity,
    getFieldError: getErrorForField,
    hasFieldError: checkFieldHasError,
  };
}
