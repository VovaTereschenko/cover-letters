import {
  updateApplicationContent,
  deleteApplication,
  copyToClipboard,
  initializeApplications,
} from "../applicationOperations";
import { localStorageService } from "../../../../lib/localStorage";
import {
  mockDispatchEvent,
  setupDispatchEventMock,
  mockClipboard,
  setupClipboardMock,
} from "../../../../test-utils/mockStorage";
import {
  MOCK_APPLICATIONS,
  createMockCallbacks,
  createConsoleSpy,
} from "../../../../test-utils/mockData";

jest.mock("../../../../lib/localStorage", () => ({
  localStorageService: {
    updateApplication: jest.fn(),
    deleteApplication: jest.fn(),
    getApplications: jest.fn(),
  },
}));

setupDispatchEventMock();
setupClipboardMock();

const { spy: consoleSpy, restore: restoreConsoleSpy } = createConsoleSpy();

describe("applicationOperations", () => {
  const callbacks = createMockCallbacks();
  const {
    onApplicationsChange: mockOnApplicationsChange,
    onApplicationsCountChange: mockOnApplicationsCountChange,
    onSuccess: mockOnSuccess,
    onError: mockOnError,
    showToast: mockShowToast,
    onHydrated: mockOnHydrated,
  } = callbacks;

  const mockLocalStorageService = localStorageService as jest.Mocked<
    typeof localStorageService
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    restoreConsoleSpy();
  });

  describe("updateApplicationContent", () => {
    const mockUpdatedApplications = MOCK_APPLICATIONS.pair;

    it("updates application content and triggers callbacks", async () => {
      mockLocalStorageService.updateApplication.mockReturnValue(
        mockUpdatedApplications
      );

      await updateApplicationContent({
        applicationId: "1",
        content: "Updated content",
        onApplicationsChange: mockOnApplicationsChange,
        onApplicationsCountChange: mockOnApplicationsCountChange,
      });

      expect(mockLocalStorageService.updateApplication).toHaveBeenCalledWith(
        "1",
        { content: "Updated content" }
      );
      expect(mockOnApplicationsChange).toHaveBeenCalledWith(
        mockUpdatedApplications
      );
      expect(mockOnApplicationsCountChange).toHaveBeenCalledWith(2);
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        new CustomEvent("applicationsUpdated")
      );
    });

    it("handles errors gracefully", async () => {
      const error = new Error("Update failed");
      mockLocalStorageService.updateApplication.mockImplementation(() => {
        throw error;
      });

      await updateApplicationContent({
        applicationId: "1",
        content: "Updated content",
        onApplicationsChange: mockOnApplicationsChange,
        onApplicationsCountChange: mockOnApplicationsCountChange,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error updating application:",
        error
      );
      expect(mockOnApplicationsChange).not.toHaveBeenCalled();
      expect(mockOnApplicationsCountChange).not.toHaveBeenCalled();
      expect(mockDispatchEvent).not.toHaveBeenCalled();
    });
  });

  describe("deleteApplication", () => {
    const mockUpdatedApplications = MOCK_APPLICATIONS.single;

    it("deletes application and triggers success callbacks", async () => {
      mockLocalStorageService.deleteApplication.mockReturnValue(
        mockUpdatedApplications
      );

      await deleteApplication({
        applicationId: "1",
        onApplicationsChange: mockOnApplicationsChange,
        onApplicationsCountChange: mockOnApplicationsCountChange,
        onSuccess: mockOnSuccess,
        onError: mockOnError,
      });

      expect(mockLocalStorageService.deleteApplication).toHaveBeenCalledWith(
        "1"
      );
      expect(mockOnApplicationsChange).toHaveBeenCalledWith(
        mockUpdatedApplications
      );
      expect(mockOnApplicationsCountChange).toHaveBeenCalledWith(1);
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        new CustomEvent("applicationsUpdated")
      );
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
    });

    it("handles errors and triggers error callback", async () => {
      const error = new Error("Delete failed");
      mockLocalStorageService.deleteApplication.mockImplementation(() => {
        throw error;
      });

      await deleteApplication({
        applicationId: "1",
        onApplicationsChange: mockOnApplicationsChange,
        onApplicationsCountChange: mockOnApplicationsCountChange,
        onSuccess: mockOnSuccess,
        onError: mockOnError,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error deleting application:",
        error
      );
      expect(mockOnApplicationsChange).not.toHaveBeenCalled();
      expect(mockOnApplicationsCountChange).not.toHaveBeenCalled();
      expect(mockDispatchEvent).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalled();
    });
  });

  describe("copyToClipboard", () => {
    it("copies content to clipboard and shows toast", () => {
      const content = "Application content to copy";

      copyToClipboard({
        content,
        showToast: mockShowToast,
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith(content);
      expect(mockShowToast).toHaveBeenCalledWith("Copied to clipboard", "copy");
    });

    it("handles different content types", () => {
      const longContent = "A".repeat(1000);

      copyToClipboard({
        content: longContent,
        showToast: mockShowToast,
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith(longContent);
      expect(mockShowToast).toHaveBeenCalledWith("Copied to clipboard", "copy");
    });

    it("handles empty content", () => {
      copyToClipboard({
        content: "",
        showToast: mockShowToast,
      });

      expect(mockClipboard.writeText).toHaveBeenCalledWith("");
      expect(mockShowToast).toHaveBeenCalledWith("Copied to clipboard", "copy");
    });
  });

  describe("initializeApplications", () => {
    it("initializes with stored applications when they exist", () => {
      const storedApplications = MOCK_APPLICATIONS.pair;

      mockLocalStorageService.getApplications.mockReturnValue(
        storedApplications
      );

      initializeApplications({
        onApplicationsChange: mockOnApplicationsChange,
        onApplicationsCountChange: mockOnApplicationsCountChange,
        onHydrated: mockOnHydrated,
      });

      expect(mockLocalStorageService.getApplications).toHaveBeenCalled();
      expect(mockOnApplicationsChange).toHaveBeenCalledWith(storedApplications);
      expect(mockOnApplicationsCountChange).toHaveBeenCalledWith(2);
      expect(mockOnHydrated).toHaveBeenCalled();
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        new CustomEvent("applicationsUpdated")
      );
    });

    it("initializes with empty array when no stored applications", () => {
      mockLocalStorageService.getApplications.mockReturnValue(
        MOCK_APPLICATIONS.empty
      );

      initializeApplications({
        onApplicationsChange: mockOnApplicationsChange,
        onApplicationsCountChange: mockOnApplicationsCountChange,
        onHydrated: mockOnHydrated,
      });

      expect(mockLocalStorageService.getApplications).toHaveBeenCalled();
      expect(mockOnApplicationsChange).toHaveBeenCalledWith(
        MOCK_APPLICATIONS.empty
      );
      expect(mockOnApplicationsCountChange).toHaveBeenCalledWith(0);
      expect(mockOnHydrated).toHaveBeenCalled();
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        new CustomEvent("applicationsUpdated")
      );
    });

    it("handles initialization with single application", () => {
      const singleApplication = MOCK_APPLICATIONS.single;

      mockLocalStorageService.getApplications.mockReturnValue(
        singleApplication
      );

      initializeApplications({
        onApplicationsChange: mockOnApplicationsChange,
        onApplicationsCountChange: mockOnApplicationsCountChange,
        onHydrated: mockOnHydrated,
      });

      expect(mockOnApplicationsChange).toHaveBeenCalledWith(singleApplication);
      expect(mockOnApplicationsCountChange).toHaveBeenCalledWith(1);
      expect(mockOnHydrated).toHaveBeenCalled();
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        new CustomEvent("applicationsUpdated")
      );
    });
  });
});
