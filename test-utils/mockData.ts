import type { SavedApplication } from "@/types";

export const createMockSavedApplication = (
  overrides: Partial<SavedApplication> = {}
): SavedApplication => ({
  id: "1",
  title: "Software Engineer Application",
  jobTitle: "Software Engineer",
  company: "Tech Corp",
  content: "Mock application content",
  createdAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

export const createMockSavedApplicationWithIdAndTitle = (
  id: string,
  title: string,
  overrides: Partial<SavedApplication> = {}
): SavedApplication => ({
  id,
  title,
  jobTitle: "Software Engineer",
  company: "Tech Corp",
  content: "Mock application content",
  createdAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

export const createMockSavedApplications = (
  count: number,
  overrides: Partial<SavedApplication>[] = []
): SavedApplication[] => {
  const baseApplications = [
    {
      id: "1",
      title: "Frontend Developer Application",
      jobTitle: "Frontend Developer",
      company: "Tech Corp",
      content: "Frontend developer cover letter",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      title: "Backend Developer Application",
      jobTitle: "Backend Developer",
      company: "Another Corp",
      content: "Backend developer cover letter",
      createdAt: "2024-01-02T00:00:00.000Z",
    },
    {
      id: "3",
      title: "Full Stack Developer Application",
      jobTitle: "Full Stack Developer",
      company: "Startup Inc",
      content: "Full stack developer cover letter",
      createdAt: "2024-01-03T00:00:00.000Z",
    },
    {
      id: "4",
      title: "Software Engineer Application",
      jobTitle: "Software Engineer",
      company: "Google",
      content: "Software Engineer cover letter for Google",
      createdAt: "2024-01-04T00:00:00.000Z",
    },
    {
      id: "5",
      title: "DevOps Engineer Application",
      jobTitle: "DevOps Engineer",
      company: "Amazon",
      content: "DevOps Engineer cover letter for Amazon",
      createdAt: "2024-01-05T00:00:00.000Z",
    },
  ];

  return baseApplications.slice(0, count).map((app, index) => ({
    ...app,
    ...(overrides[index] || {}),
  }));
};

export const MOCK_APPLICATIONS = {
  empty: [] as SavedApplication[],
  single: createMockSavedApplications(1),
  pair: createMockSavedApplications(2),
  multiple: createMockSavedApplications(3),
  full: createMockSavedApplications(5),
};

export const createMockCallbacks = () => ({
  onApplicationsChange: jest.fn(),
  onApplicationsCountChange: jest.fn(),
  onSavedApplicationIdChange: jest.fn(),
  onGeneratedApplicationChange: jest.fn(),
  onSuccess: jest.fn(),
  onError: jest.fn(),
  showToast: jest.fn(),
  onChange: jest.fn(),
  onFocus: jest.fn(),
  onBlur: jest.fn(),
  onClick: jest.fn(),
  onSubmit: jest.fn(),
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
  onCreateNew: jest.fn(),
  autoSaveApplication: jest.fn().mockResolvedValue(undefined),
});

export const createMockLocalStorageService = () => ({
  addApplication: jest.fn(),
  updateApplication: jest.fn(),
  deleteApplication: jest.fn(),
  getApplications: jest.fn(),
  getApplication: jest.fn(),
});

export const createMockRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
});

export const MOCK_FORM_DATA = {
  basic: {
    jobTitle: "Software Engineer",
    company: "Tech Corp",
    skills: "JavaScript, React, Node.js",
    additionalDetails: "Experienced developer",
  },
  detailed: {
    jobTitle: "Senior Frontend Developer",
    company: "Meta",
    skills: "React, TypeScript, GraphQL, Next.js",
    additionalDetails: "5+ years experience building scalable web applications",
  },
  minimal: {
    jobTitle: "Developer",
    company: "Company",
    skills: "Programming",
    additionalDetails: "Details",
  },
};

export const createMockApplicationStorageProps = (
  overrides: Partial<{
    titleText: string;
    company: string;
    jobTitle: string;
    applicationsCount: number;
    savedApplicationId: string;
    onSavedApplicationIdChange: jest.Mock;
    onApplicationsCountChange: jest.Mock;
  }> = {}
) => {
  const callbacks = createMockCallbacks();

  return {
    titleText: "Software Engineer, Tech Corp",
    company: "Tech Corp",
    jobTitle: "Software Engineer",
    applicationsCount: 5,
    savedApplicationId: "",
    onSavedApplicationIdChange: callbacks.onSavedApplicationIdChange,
    onApplicationsCountChange: callbacks.onApplicationsCountChange,
    ...overrides,
  };
};

export const createConsoleSpy = () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  return {
    spy: consoleSpy,
    restore: () => consoleSpy.mockRestore(),
  };
};

export const createDateMock = (timestamp: number = 1234567890000) => {
  const mockDateNow = jest.spyOn(Date, "now").mockReturnValue(timestamp);
  return {
    mock: mockDateNow,
    restore: () => mockDateNow.mockRestore(),
  };
};
