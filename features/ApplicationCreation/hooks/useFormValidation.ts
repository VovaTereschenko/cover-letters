import { useCallback } from "react";
import {
  validateField,
  validateJobApplicationForm,
  type JobApplicationFormData,
} from "@/lib/validations";
import type { JobApplicationState, JobApplicationAction } from "../types";

export function useFormValidation(
  state: JobApplicationState,
  dispatch: React.Dispatch<JobApplicationAction>
) {
  const handleFieldValidation = useCallback(
    (fieldName: keyof JobApplicationFormData, value: string) => {
      const validation = validateField(fieldName, value);
      if (!validation.success && validation.error) {
        dispatch({
          type: "SET_VALIDATION_ERRORS",
          payload: { ...state.validationErrors, [fieldName]: validation.error },
        });
      } else {
        dispatch({ type: "CLEAR_VALIDATION_ERROR", payload: fieldName });
      }
    },
    [state.validationErrors, dispatch]
  );

  const isFormValid = useCallback(() => {
    const formData = {
      jobTitle: state.jobTitle,
      company: state.company,
      skills: state.skills,
      additionalDetails: state.additionalDetails,
    };

    const validation = validateJobApplicationForm(formData);
    return validation.success;
  }, [state.jobTitle, state.company, state.skills, state.additionalDetails]);

  const getFieldError = useCallback(
    (fieldName: keyof JobApplicationFormData) => {
      return state.validationErrors[fieldName];
    },
    [state.validationErrors]
  );

  const hasFieldError = useCallback(
    (fieldName: keyof JobApplicationFormData) => {
      return Boolean(state.validationErrors[fieldName]);
    },
    [state.validationErrors]
  );

  return {
    handleFieldValidation,
    isFormValid,
    getFieldError,
    hasFieldError,
  };
}
