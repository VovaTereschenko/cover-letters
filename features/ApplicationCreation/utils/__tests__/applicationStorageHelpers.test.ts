import { createApplicationStorageHelpers } from "../applicationStorageHelpers";
import { localStorageService } from "../../../../lib/localStorage";
import { handleGoalAchievement } from "../goalAchievement";
import { deleteSavedApplication } from "../applicationStorage";
import {
  mockDispatchEvent,
  setupDispatchEventMock,
} from "../../../../test-utils/mockStorage";
import {
  createMockApplicationStorageProps,
  createConsoleSpy,
  createDateMock,
  createMockSavedApplicationWithIdAndTitle as createMockSavedApplication,
} from "../../../../test-utils/mockData";

jest.mock("../../../../lib/localStorage", () => ({
  localStorageService: {
    addApplication: jest.fn(),
    deleteApplication: jest.fn(),
  },
}));

jest.mock("../goalAchievement", () => ({
  handleGoalAchievement: jest.fn(),
}));

jest.mock("../applicationStorage", () => ({
  deleteSavedApplication: jest.fn(),
}));

setupDispatchEventMock();

const { spy: consoleSpy, restore: restoreConsoleSpy } = createConsoleSpy();
const { mock: mockDateNow, restore: restoreDateMock } = createDateMock();

describe("createApplicationStorageHelpers", () => {
  const mockLocalStorageService = localStorageService as jest.Mocked<
    typeof localStorageService
  >;
  const mockHandleGoalAchievement =
    handleGoalAchievement as jest.MockedFunction<typeof handleGoalAchievement>;
  const mockDeleteSavedApplication =
    deleteSavedApplication as jest.MockedFunction<
      typeof deleteSavedApplication
    >;

  const defaultProps = createMockApplicationStorageProps();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    restoreConsoleSpy();
    restoreDateMock();
  });

  describe("autoSaveApplication", () => {
    it("saves new application successfully", async () => {
      const mockUpdatedApplications = [
        createMockSavedApplication("1", "App 1"),
        createMockSavedApplication("2", "App 2"),
        createMockSavedApplication(
          "1234567890000",
          "Software Engineer, Tech Corp"
        ),
      ];
      mockLocalStorageService.addApplication.mockReturnValue(
        mockUpdatedApplications
      );

      const helpers = createApplicationStorageHelpers(defaultProps);
      const content = "Generated cover letter content";

      await helpers.autoSaveApplication(content);

      expect(mockLocalStorageService.addApplication).toHaveBeenCalledWith({
        id: "1234567890000",
        title: "Software Engineer, Tech Corp",
        company: "Tech Corp",
        jobTitle: "Software Engineer",
        content: "Generated cover letter content",
        createdAt: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        ),
      });

      expect(defaultProps.onSavedApplicationIdChange).toHaveBeenCalledWith(
        "1234567890000"
      );
      expect(defaultProps.onApplicationsCountChange).toHaveBeenCalledWith(3);
      expect(mockHandleGoalAchievement).toHaveBeenCalledWith(3, 5);
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        new CustomEvent("applicationsUpdated")
      );
    });

    it("deletes existing application before saving new one", async () => {
      const propsWithExistingApp = {
        ...defaultProps,
        savedApplicationId: "existing-app-123",
      };
      const mockUpdatedApplications = [
        createMockSavedApplication("1234567890000", "New App"),
      ];
      mockLocalStorageService.addApplication.mockReturnValue(
        mockUpdatedApplications
      );

      const helpers = createApplicationStorageHelpers(propsWithExistingApp);
      const content = "New content";

      await helpers.autoSaveApplication(content);

      expect(mockLocalStorageService.deleteApplication).toHaveBeenCalledWith(
        "existing-app-123"
      );
      expect(mockLocalStorageService.addApplication).toHaveBeenCalledWith({
        id: "1234567890000",
        title: "Software Engineer, Tech Corp",
        company: "Tech Corp",
        jobTitle: "Software Engineer",
        content: "New content",
        createdAt: expect.any(String),
      });
    });

    it("handles save errors gracefully", async () => {
      const error = new Error("Storage error");
      mockLocalStorageService.addApplication.mockImplementation(() => {
        throw error;
      });

      const helpers = createApplicationStorageHelpers(defaultProps);
      const content = "Test content";

      await helpers.autoSaveApplication(content);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving application:",
        error
      );
      expect(defaultProps.onSavedApplicationIdChange).not.toHaveBeenCalled();
      expect(defaultProps.onApplicationsCountChange).not.toHaveBeenCalled();
      expect(mockHandleGoalAchievement).not.toHaveBeenCalled();
      expect(mockDispatchEvent).not.toHaveBeenCalled();
    });

    it("generates unique ID based on timestamp", async () => {
      const mockUpdatedApplications = [
        createMockSavedApplication("1234567890000", "Test"),
      ];
      mockLocalStorageService.addApplication.mockReturnValue(
        mockUpdatedApplications
      );

      const helpers = createApplicationStorageHelpers(defaultProps);
      await helpers.autoSaveApplication("content");

      expect(mockLocalStorageService.addApplication).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "1234567890000",
        })
      );
    });

    it("creates ISO string for createdAt", async () => {
      const mockUpdatedApplications = [
        createMockSavedApplication("1234567890000", "Test"),
      ];
      mockLocalStorageService.addApplication.mockReturnValue(
        mockUpdatedApplications
      );

      const helpers = createApplicationStorageHelpers(defaultProps);
      await helpers.autoSaveApplication("content");

      const call = mockLocalStorageService.addApplication.mock.calls[0][0];
      expect(call.createdAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
      expect(new Date(call.createdAt).getTime()).toBeGreaterThan(0);
    });

    it("triggers goal achievement check with correct counts", async () => {
      const mockUpdatedApplications = new Array(10)
        .fill(null)
        .map((_, i) => createMockSavedApplication(`app-${i}`, `App ${i}`));
      mockLocalStorageService.addApplication.mockReturnValue(
        mockUpdatedApplications
      );

      const helpers = createApplicationStorageHelpers({
        ...defaultProps,
        applicationsCount: 9,
      });

      await helpers.autoSaveApplication("content");

      expect(mockHandleGoalAchievement).toHaveBeenCalledWith(10, 9);
    });
  });

  describe("deleteSavedApplication", () => {
    it("calls deleteSavedApplication with correct parameters", () => {
      const helpers = createApplicationStorageHelpers({
        ...defaultProps,
        savedApplicationId: "app-to-delete",
      });

      helpers.deleteSavedApplication();

      expect(mockDeleteSavedApplication).toHaveBeenCalledWith(
        "app-to-delete",
        defaultProps.onApplicationsCountChange,
        defaultProps.onSavedApplicationIdChange
      );
    });

    it("calls deleteSavedApplication even with empty savedApplicationId", () => {
      const helpers = createApplicationStorageHelpers(defaultProps);

      helpers.deleteSavedApplication();

      expect(mockDeleteSavedApplication).toHaveBeenCalledWith(
        "",
        defaultProps.onApplicationsCountChange,
        defaultProps.onSavedApplicationIdChange
      );
    });
  });

  describe("edge cases", () => {
    it("handles empty title text", async () => {
      const mockUpdatedApplications = [
        createMockSavedApplication("1234567890000", ""),
      ];
      mockLocalStorageService.addApplication.mockReturnValue(
        mockUpdatedApplications
      );

      const helpers = createApplicationStorageHelpers({
        ...defaultProps,
        titleText: "",
      });

      await helpers.autoSaveApplication("content");

      expect(mockLocalStorageService.addApplication).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "",
        })
      );
    });

    it("handles empty company and jobTitle", async () => {
      const mockUpdatedApplications = [
        createMockSavedApplication("1234567890000", "Test"),
      ];
      mockLocalStorageService.addApplication.mockReturnValue(
        mockUpdatedApplications
      );

      const helpers = createApplicationStorageHelpers({
        ...defaultProps,
        company: "",
        jobTitle: "",
      });

      await helpers.autoSaveApplication("content");

      expect(mockLocalStorageService.addApplication).toHaveBeenCalledWith(
        expect.objectContaining({
          company: "",
          jobTitle: "",
        })
      );
    });

    it("handles zero applications count", async () => {
      const mockUpdatedApplications = [
        createMockSavedApplication("1234567890000", "First App"),
      ];
      mockLocalStorageService.addApplication.mockReturnValue(
        mockUpdatedApplications
      );

      const helpers = createApplicationStorageHelpers({
        ...defaultProps,
        applicationsCount: 0,
      });

      await helpers.autoSaveApplication("content");

      expect(mockHandleGoalAchievement).toHaveBeenCalledWith(1, 0);
    });
  });
});
