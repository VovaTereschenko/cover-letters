import { z } from "zod";

export const jobApplicationSchema = z.object({
  jobTitle: z
    .string()
    .trim()
    .min(1, "Job title is required")
    .max(100, "Job title must be less than 100 characters"),
  company: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  skills: z
    .string()
    .trim()
    .min(1, "Skills are required")
    .max(500, "Skills must be less than 500 characters"),
  additionalDetails: z
    .string()
    .trim()
    .min(1, "Additional details are required")
    .max(1200, "Additional details must be less than 1200 characters"),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

export const fieldValidationSchemas = {
  jobTitle: jobApplicationSchema.shape.jobTitle,
  company: jobApplicationSchema.shape.company,
  skills: jobApplicationSchema.shape.skills,
  additionalDetails: jobApplicationSchema.shape.additionalDetails,
};

export function validateField(
  fieldName: keyof JobApplicationFormData,
  value: string
) {
  try {
    fieldValidationSchemas[fieldName].parse(value);
    return { success: true, error: undefined };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Invalid value",
      };
    }
    return { success: false, error: "Invalid value" };
  }
}

export function validateJobApplicationForm(
  data: Partial<JobApplicationFormData>
) {
  try {
    const validated = jobApplicationSchema.parse(data);
    return { success: true, data: validated, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Partial<Record<keyof JobApplicationFormData, string>> = {};
      error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as keyof JobApplicationFormData] = issue.message;
        }
      });
      return { success: false, data: null, errors };
    }
    return {
      success: false,
      data: null,
      errors: { general: "Validation failed" },
    };
  }
}
