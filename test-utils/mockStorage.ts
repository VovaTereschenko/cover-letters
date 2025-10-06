export const createMockStorage = () => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn(),
  };
};

export const mockSessionStorage = createMockStorage();
export const mockLocalStorage = createMockStorage();

export const mockMatchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

export const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
  readText: jest.fn().mockResolvedValue(""),
};

export const mockFetch = jest.fn();

export const mockDispatchEvent = jest.fn();

export const setupSessionStorageMock = () => {
  Object.defineProperty(window, "sessionStorage", {
    value: mockSessionStorage,
    writable: true,
    configurable: true,
  });
};

export const setupLocalStorageMock = () => {
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
    writable: true,
    configurable: true,
  });
};

export const setupMatchMediaMock = () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: mockMatchMedia,
  });
};

export const setupClipboardMock = () => {
  Object.defineProperty(navigator, "clipboard", {
    value: mockClipboard,
    writable: true,
    configurable: true,
  });
};

export const setupFetchMock = () => {
  global.fetch = mockFetch;
};

export const setupDispatchEventMock = () => {
  Object.defineProperty(window, "dispatchEvent", {
    value: mockDispatchEvent,
    writable: true,
    configurable: true,
  });
};

export const setupAllBrowserMocks = () => {
  setupLocalStorageMock();
  setupSessionStorageMock();
  setupMatchMediaMock();
  setupClipboardMock();
  setupFetchMock();
  setupDispatchEventMock();
};
