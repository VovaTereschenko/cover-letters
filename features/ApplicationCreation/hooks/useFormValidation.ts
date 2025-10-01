import type { JobApplicationFormData } from "@/lib/validations";
import type { JobApplicationState, JobApplicationAction } from "../types";
import {
  handleFieldValidation as handleFieldValidationUtil,
  isFormValid as isFormValidUtil,
  getFieldError as getFieldErrorUtil,
  hasFieldError as hasFieldErrorUtil,
} from "../utils/formValidation";

export function useFormValidation(
  state: JobApplicationState,
  dispatch: React.Dispatch<JobApplicationAction>
) {
  const handleFieldValidation = (
    fieldName: keyof JobApplicationFormData,
    value: string
  ) => {
    handleFieldValidationUtil(
      fieldName,
      value,
      state.validationErrors,
      dispatch
    );
  };

  const isFormValid = () => {
    const formData = {
      jobTitle: state.jobTitle,
      company: state.company,
      skills: state.skills,
      additionalDetails: state.additionalDetails,
    };

    return isFormValidUtil(formData);
  };

  const getFieldError = (fieldName: keyof JobApplicationFormData) => {
    return getFieldErrorUtil(fieldName, state.validationErrors);
  };

  const hasFieldError = (fieldName: keyof JobApplicationFormData) => {
    return hasFieldErrorUtil(fieldName, state.validationErrors);
  };

  return {
    handleFieldValidation,
    isFormValid,
    getFieldError,
    hasFieldError,
  };
}
