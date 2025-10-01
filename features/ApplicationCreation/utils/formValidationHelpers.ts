import type { JobApplicationFormData } from "@/lib/validations";
import type { JobApplicationState, JobApplicationAction } from "../types";
import {
  handleFieldValidation as handleFieldValidationUtility,
  isFormValid as isFormValidUtility,
  getFieldError as getFieldErrorUtility,
  hasFieldError as hasFieldErrorUtility,
} from "../utils/formValidation";

export function createFormValidation({
  state,
  dispatch,
}: {
  state: JobApplicationState;
  dispatch: React.Dispatch<JobApplicationAction>;
}) {
  const handleFieldValidation = (
    fieldName: keyof JobApplicationFormData,
    value: string
  ) => {
    handleFieldValidationUtility(
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

    return isFormValidUtility(formData);
  };

  const getFieldError = (fieldName: keyof JobApplicationFormData) =>
    getFieldErrorUtility(fieldName, state.validationErrors);

  const hasFieldError = (fieldName: keyof JobApplicationFormData) =>
    hasFieldErrorUtility(fieldName, state.validationErrors);

  return {
    handleFieldValidation,
    isFormValid,
    getFieldError,
    hasFieldError,
  };
}
