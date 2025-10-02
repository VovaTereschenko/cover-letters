import { updateTitleFromFields, getTitleClassName } from "./titleManagement";

export function createTitleManagerHelpers({
  jobTitle,
  company,
  titleText,
  onTitleChange,
}: {
  jobTitle: string;
  company: string;
  titleText: string;
  onTitleChange: (title: string) => void;
}) {
  const updateTitle = () => {
    updateTitleFromFields(jobTitle, company, onTitleChange);
  };

  const getClassName = (styles: Record<string, string>) => {
    return getTitleClassName(titleText, styles);
  };

  return {
    updateTitleFromFields: updateTitle,
    getTitleClassName: getClassName,
  };
}
