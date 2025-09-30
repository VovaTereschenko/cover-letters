const RECOMMENDED_AMOUNT_OF_APPLICATIONS = 5;
const DEFAULT_SINGULAR_TEXT = "application generated";
const DEFAULT_PLURAL_TEXT = "applications generated";

// Storage keys
const STORAGE_KEYS = {
  APPLICATIONS: "saved_applications",
  GOAL_ACHIEVEMENT: "justReached5Applications",
} as const;

export {
  RECOMMENDED_AMOUNT_OF_APPLICATIONS,
  DEFAULT_SINGULAR_TEXT,
  DEFAULT_PLURAL_TEXT,
  STORAGE_KEYS,
};
