import {
  createCoverLetterRequest,
  handleGenerationSuccess,
  handleGenerationError,
} from "../coverLetterGeneration";
import { UI_MESSAGES, AI_PROMPTS } from "@/constants/ai";
import { setupFetchMock } from "../../../../test-utils/mockStorage";
import {
  MOCK_FORM_DATA,
  createMockCallbacks,
} from "../../../../test-utils/mockData";

setupFetchMock();

describe("coverLetterGeneration", () => {
  const callbacks = createMockCallbacks();
  const {
    onGeneratedApplicationChange: mockOnGeneratedApplicationChange,
    showToast: mockShowToast,
    autoSaveApplication: mockAutoSaveApplication,
  } = callbacks;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCoverLetterRequest", () => {
    it("makes POST request to correct endpoint with form data", () => {
      const formData = MOCK_FORM_DATA.basic;
      const abortController = new AbortController();

      createCoverLetterRequest(formData, abortController);

      expect(fetch).toHaveBeenCalledWith("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: abortController.signal,
      });
    });

    it("includes abort signal in request", () => {
      const formData = MOCK_FORM_DATA.minimal;
      const abortController = new AbortController();

      createCoverLetterRequest(formData, abortController);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: abortController.signal,
        })
      );
    });
  });

  describe("handleGenerationSuccess", () => {
    it("processes successful generation correctly", async () => {
      const coverLetter = "Generated cover letter content";

      await handleGenerationSuccess({
        coverLetter,
        onGeneratedApplicationChange: mockOnGeneratedApplicationChange,
        showToast: mockShowToast,
        autoSaveApplication: mockAutoSaveApplication,
      });

      expect(mockOnGeneratedApplicationChange).toHaveBeenCalledWith(
        coverLetter
      );
      expect(mockShowToast).toHaveBeenCalledWith(
        UI_MESSAGES.toasts.generatedSuccessfully,
        "save"
      );
      expect(mockAutoSaveApplication).toHaveBeenCalledWith(coverLetter);
    });

    it("waits before auto-saving application", async () => {
      jest.useFakeTimers();

      const coverLetter = "Test content";

      const promise = handleGenerationSuccess({
        coverLetter,
        onGeneratedApplicationChange: mockOnGeneratedApplicationChange,
        showToast: mockShowToast,
        autoSaveApplication: mockAutoSaveApplication,
      });

      jest.advanceTimersByTime(100);
      await promise;

      expect(mockAutoSaveApplication).toHaveBeenCalledWith(coverLetter);

      jest.useRealTimers();
    });
  });

  describe("handleGenerationError", () => {
    it("handles non-abort errors correctly", async () => {
      const error = new Error("Network error");

      await handleGenerationError({
        error,
        onGeneratedApplicationChange: mockOnGeneratedApplicationChange,
        showToast: mockShowToast,
        autoSaveApplication: mockAutoSaveApplication,
      });

      expect(mockOnGeneratedApplicationChange).toHaveBeenCalledWith(
        AI_PROMPTS.fallbackTemplate("", "", "", "")
      );
      expect(mockShowToast).toHaveBeenCalledWith(
        UI_MESSAGES.toasts.generatedWithFallback,
        "save"
      );
      expect(mockAutoSaveApplication).toHaveBeenCalledWith(
        AI_PROMPTS.fallbackTemplate("", "", "", "")
      );
    });

    it("does not log abort errors", async () => {
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";

      await handleGenerationError({
        error: abortError,
        onGeneratedApplicationChange: mockOnGeneratedApplicationChange,
        showToast: mockShowToast,
        autoSaveApplication: mockAutoSaveApplication,
      });

      expect(mockOnGeneratedApplicationChange).toHaveBeenCalledWith(
        AI_PROMPTS.fallbackTemplate("", "", "", "")
      );
      expect(mockShowToast).toHaveBeenCalledWith(
        UI_MESSAGES.toasts.generatedWithFallback,
        "save"
      );
    });

    it("waits before auto-saving fallback application", async () => {
      jest.useFakeTimers();

      const error = new Error("Test error");

      const promise = handleGenerationError({
        error,
        onGeneratedApplicationChange: mockOnGeneratedApplicationChange,
        showToast: mockShowToast,
        autoSaveApplication: mockAutoSaveApplication,
      });

      jest.advanceTimersByTime(100);
      await promise;

      expect(mockAutoSaveApplication).toHaveBeenCalledWith(
        AI_PROMPTS.fallbackTemplate("", "", "", "")
      );

      jest.useRealTimers();
    });

    it("handles unknown error types gracefully", async () => {
      const error = "String error";

      await handleGenerationError({
        error,
        onGeneratedApplicationChange: mockOnGeneratedApplicationChange,
        showToast: mockShowToast,
        autoSaveApplication: mockAutoSaveApplication,
      });

      expect(mockOnGeneratedApplicationChange).toHaveBeenCalledWith(
        AI_PROMPTS.fallbackTemplate("", "", "", "")
      );
    });
  });
});
