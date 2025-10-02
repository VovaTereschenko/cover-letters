import { UI_MESSAGES } from "@/constants/ai";

export const updateTitleFromFields = (
  jobTitle: string,
  company: string,
  onTitleChange: (title: string) => void
) => {
  if (!jobTitle.trim() && !company.trim()) {
    onTitleChange(UI_MESSAGES.newApplication);
    return;
  }

  const parts = [];
  if (jobTitle.trim()) {
    parts.push(jobTitle.trim());
  }
  if (company.trim()) {
    parts.push(company.trim());
  }

  onTitleChange(parts.join(", "));
};

export const getTitleClassName = (
  titleText: string,
  styles: Record<string, string>
) => {
  if (titleText === UI_MESSAGES.newApplication) {
    return `title-primary ${styles.title} ${styles.titlePlaceholder}`;
  }
  return `title-primary ${styles.title}`;
};
