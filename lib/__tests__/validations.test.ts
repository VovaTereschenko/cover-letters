import {
  validateField,
  validateJobApplicationForm,
  jobApplicationSchema,
  type JobApplicationFormData,
} from "../validations";

describe("Job Application Validation", () => {
  describe("validateField", () => {
    it("validates job title correctly", () => {
      expect(validateField("jobTitle", "Software Engineer")).toEqual({
        success: true,
        error: undefined,
      });

      expect(validateField("jobTitle", "")).toEqual({
        success: false,
        error: "Job title is required",
      });

      expect(validateField("jobTitle", "a".repeat(101))).toEqual({
        success: false,
        error: "Job title must be less than 100 characters",
      });
    });

    it("validates company correctly", () => {
      expect(validateField("company", "Google")).toEqual({
        success: true,
        error: undefined,
      });

      expect(validateField("company", "")).toEqual({
        success: false,
        error: "Company name is required",
      });
    });

    it("validates skills correctly", () => {
      expect(validateField("skills", "React, TypeScript")).toEqual({
        success: true,
        error: undefined,
      });

      expect(validateField("skills", "")).toEqual({
        success: false,
        error: "Skills are required",
      });

      expect(validateField("skills", "a".repeat(501))).toEqual({
        success: false,
        error: "Skills must be less than 500 characters",
      });
    });

    it("validates additional details correctly", () => {
      expect(validateField("additionalDetails", "Some details")).toEqual({
        success: true,
        error: undefined,
      });

      expect(validateField("additionalDetails", "")).toEqual({
        success: false,
        error: "Additional details are required",
      });

      expect(validateField("additionalDetails", "a".repeat(1201))).toEqual({
        success: false,
        error: "Additional details must be less than 1200 characters",
      });
    });
  });

  describe("validateJobApplicationForm", () => {
    const validData: JobApplicationFormData = {
      jobTitle: "Software Engineer",
      company: "Google",
      skills: "React, TypeScript, Node.js",
      additionalDetails: "Experienced developer with 5 years of experience",
    };

    it("validates complete valid form", () => {
      const result = validateJobApplicationForm(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
      expect(result.errors).toEqual({});
    });

    it("validates form with missing fields", () => {
      const invalidData = {
        jobTitle: "",
        company: "Google",
        skills: "",
        additionalDetails: "Some details",
      };

      const result = validateJobApplicationForm(invalidData);
      expect(result.success).toBe(false);
      expect(result.data).toBe(null);
      expect(result.errors).toEqual({
        jobTitle: "Job title is required",
        skills: "Skills are required",
      });
    });

    it("validates form with fields too long", () => {
      const invalidData = {
        jobTitle: "a".repeat(101),
        company: "Google",
        skills: "React",
        additionalDetails: "a".repeat(1201),
      };

      const result = validateJobApplicationForm(invalidData);
      expect(result.success).toBe(false);
      expect(result.data).toBe(null);
      expect(result.errors).toEqual({
        jobTitle: "Job title must be less than 100 characters",
        additionalDetails:
          "Additional details must be less than 1200 characters",
      });
    });
  });

  describe("jobApplicationSchema", () => {
    it("trims whitespace from fields", () => {
      const dataWithWhitespace = {
        jobTitle: "  Software Engineer  ",
        company: "  Google  ",
        skills: "  React, TypeScript  ",
        additionalDetails: "  Some details  ",
      };

      const result = jobApplicationSchema.parse(dataWithWhitespace);
      expect(result).toEqual({
        jobTitle: "Software Engineer",
        company: "Google",
        skills: "React, TypeScript",
        additionalDetails: "Some details",
      });
    });
  });
});
