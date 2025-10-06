import { deleteSavedApplication } from "../applicationStorage";
import { localStorageService } from "../../../../lib/localStorage";
import {
  mockDispatchEvent,
  setupDispatchEventMock,
} from "../../../../test-utils/mockStorage";
import {
  MOCK_APPLICATIONS,
  createMockCallbacks,
  createConsoleSpy,
} from "../../../../test-utils/mockData";

jest.mock("../../../../lib/localStorage", () => ({
  localStorageService: {
    deleteApplication: jest.fn(),
  },
}));

setupDispatchEventMock();

const { spy: consoleSpy, restore: restoreConsoleSpy } = createConsoleSpy();

describe("deleteSavedApplication", () => {
  const callbacks = createMockCallbacks();
  const {
    onApplicationsCountChange: mockOnApplicationsCountChange,
    onSavedApplicationIdChange: mockOnSavedApplicationIdChange,
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

  it("deletes application and updates state when savedApplicationId is provided", async () => {
    const savedApplicationId = "test-app-123";
    const mockUpdatedApplications = MOCK_APPLICATIONS.pair;

    mockLocalStorageService.deleteApplication.mockReturnValue(
      mockUpdatedApplications
    );

    await deleteSavedApplication(
      savedApplicationId,
      mockOnApplicationsCountChange,
      mockOnSavedApplicationIdChange
    );

    expect(mockLocalStorageService.deleteApplication).toHaveBeenCalledWith(
      savedApplicationId
    );
    expect(mockOnApplicationsCountChange).toHaveBeenCalledWith(2);
    expect(mockOnSavedApplicationIdChange).toHaveBeenCalledWith("");
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      new CustomEvent("applicationsUpdated")
    );
  });

  it("does nothing when savedApplicationId is empty string", async () => {
    await deleteSavedApplication(
      "",
      mockOnApplicationsCountChange,
      mockOnSavedApplicationIdChange
    );

    expect(mockLocalStorageService.deleteApplication).not.toHaveBeenCalled();
    expect(mockOnApplicationsCountChange).not.toHaveBeenCalled();
    expect(mockOnSavedApplicationIdChange).not.toHaveBeenCalled();
    expect(mockDispatchEvent).not.toHaveBeenCalled();
  });

  it("does nothing when savedApplicationId is null or undefined", async () => {
    await deleteSavedApplication(
      null as unknown as string,
      mockOnApplicationsCountChange,
      mockOnSavedApplicationIdChange
    );

    await deleteSavedApplication(
      undefined as unknown as string,
      mockOnApplicationsCountChange,
      mockOnSavedApplicationIdChange
    );

    expect(mockLocalStorageService.deleteApplication).not.toHaveBeenCalled();
    expect(mockOnApplicationsCountChange).not.toHaveBeenCalled();
    expect(mockOnSavedApplicationIdChange).not.toHaveBeenCalled();
    expect(mockDispatchEvent).not.toHaveBeenCalled();
  });

  it("handles errors gracefully and logs them", async () => {
    const savedApplicationId = "test-app-123";
    const error = new Error("Storage error");

    mockLocalStorageService.deleteApplication.mockImplementation(() => {
      throw error;
    });

    await deleteSavedApplication(
      savedApplicationId,
      mockOnApplicationsCountChange,
      mockOnSavedApplicationIdChange
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error deleting application:",
      error
    );
    expect(mockOnApplicationsCountChange).not.toHaveBeenCalled();
    expect(mockOnSavedApplicationIdChange).not.toHaveBeenCalled();
    expect(mockDispatchEvent).not.toHaveBeenCalled();
  });

  it("updates applications count correctly with empty array", async () => {
    const savedApplicationId = "last-app";
    const mockUpdatedApplications = MOCK_APPLICATIONS.empty;

    mockLocalStorageService.deleteApplication.mockReturnValue(
      mockUpdatedApplications
    );

    await deleteSavedApplication(
      savedApplicationId,
      mockOnApplicationsCountChange,
      mockOnSavedApplicationIdChange
    );

    expect(mockOnApplicationsCountChange).toHaveBeenCalledWith(0);
    expect(mockOnSavedApplicationIdChange).toHaveBeenCalledWith("");
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      new CustomEvent("applicationsUpdated")
    );
  });
});
