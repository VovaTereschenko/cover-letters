export type SavedApplication = {
  id: string;
  title: string;
  company: string;
  jobTitle: string;
  content: string;
  createdAt: string;
};

export type ToastType = "save" | "copy" | "delete" | "error";

export type ProgressHighlightColor = "positive" | "negative";

export type HighlightColor = ProgressHighlightColor | null;
